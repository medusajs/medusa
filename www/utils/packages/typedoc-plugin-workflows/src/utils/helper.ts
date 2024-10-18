import {
  DeclarationReflection,
  ParameterReflection,
  ProjectReflection,
} from "typedoc"
import ts from "typescript"
import { StepModifier, StepType } from "../types"
import { capitalize } from "utils"

/**
 * A class of helper methods.
 */
export default class Helper {
  /**
   * Remove from a name, preferrably a function expression's name, extraneous details.
   *
   * @param name - The name to normalize.
   * @returns The normalized name.
   */
  normalizeName(name: string) {
    const nameWithoutQuotes = name.replace(/^"/, "").replace(/"$/, "")

    const dotPos = nameWithoutQuotes.indexOf(".")
    const parenPos = nameWithoutQuotes.indexOf("(")

    // If both indices of dot and parenthesis are -1, set endIndex to -1
    // if one of them is -1, use the other's value
    // if both aren't -1, use the minimum
    const endIndex =
      dotPos === -1 && parenPos === -1
        ? -1
        : dotPos === -1
          ? parenPos
          : parenPos === -1
            ? dotPos
            : Math.min(dotPos, parenPos)

    return nameWithoutQuotes.substring(
      0,
      endIndex === -1 ? nameWithoutQuotes.length : endIndex
    )
  }

  /**
   * Get symbol and initializer of a reflection.
   *
   * @param param0 - The reflection's details.
   * @returns The symbol and initializer, if found.
   */
  getReflectionSymbolAndInitializer({
    project,
    reflection,
  }: {
    project: ProjectReflection
    reflection: DeclarationReflection
  }):
    | {
        symbol: ts.Symbol
        initializer: ts.CallExpression
      }
    | undefined {
    const symbol = project.getSymbolFromReflection(reflection)

    if (
      !symbol ||
      !symbol.valueDeclaration ||
      !("initializer" in symbol.valueDeclaration)
    ) {
      return
    }

    return {
      symbol,
      initializer: symbol.valueDeclaration.initializer as ts.CallExpression,
    }
  }

  /**
   * Get the ID of a step or a workflow.
   *
   * @param initializer - The associated initializer. For example, `createWorkflow`.
   * @param project - The typedoc project.
   * @param checkWorkflowStep - Whether to check if a workflow is a step. If enabled, the `-as-step` suffix is added
   * to the ID. This is useful when testing against the workflow's steps retrieved by the workflow manager.
   * @returns The ID of the step or workflow.
   */
  getStepOrWorkflowId(
    initializer: ts.CallExpression | ts.ArrowFunction,
    project: ProjectReflection,
    type: "workflow" | "step",
    checkWorkflowStep = false
  ): string | undefined {
    const callInitializer = ts.isCallExpression(initializer)
      ? initializer
      : this.getCallExpressionFromBody(initializer.body)
    if (!callInitializer) {
      throw new Error(
        `Couldn't find initializer of a step or workflow: ${initializer.getText()}`
      )
    }
    const idArg = callInitializer.arguments[0]
    const isWorkflowStep =
      checkWorkflowStep && this.getStepType(callInitializer) === "workflowStep"
    const idArgValue = this.normalizeName(idArg.getText())

    let stepId: string | undefined

    if (ts.isObjectLiteralExpression(idArg)) {
      const nameProperty = idArg.properties.find(
        (property) => property.name?.getText() === "name"
      )

      if (nameProperty && ts.isPropertyAssignment(nameProperty)) {
        const nameValue = this.normalizeName(nameProperty.initializer.getText())
        stepId = ts.isStringLiteral(nameProperty.initializer)
          ? nameValue
          : this.getValueFromReflection(nameValue, project)
      }
    } else if (!ts.isStringLiteral(idArg)) {
      stepId = this.getValueFromReflection(idArgValue, project)
    } else {
      stepId = idArgValue
    }

    if (!stepId && ts.isArrowFunction(initializer)) {
      stepId = this._getStepOrWorkflowIdFromArrowFunction(initializer, type)
    }

    return isWorkflowStep ? `${stepId}-as-step` : stepId
  }

  private _getStepOrWorkflowIdFromArrowFunction(
    initializer: ts.ArrowFunction,
    type: "workflow" | "step"
  ) {
    // for arrow functions, the inner workflow / step isn't exported
    // so we have to rely on a hacky way of retrieving the ID from the source file
    const sourceFile = initializer.getSourceFile()
    const localMap: Map<string, ts.Symbol> =
      "locals" in sourceFile
        ? (sourceFile.locals as Map<string, ts.Symbol>)
        : new Map()

    if (!localMap.size) {
      throw new Error(`Couldn't find ID of ${type}: ${initializer.getText()}`)
    }

    let id = ""
    const capitalizedType = capitalize(type)

    localMap.forEach((value, key) => {
      if (
        !key.endsWith(`${capitalizedType}Id`) ||
        id.length ||
        !value.declarations?.length ||
        !ts.isVariableDeclaration(value.declarations[0])
      ) {
        return
      }

      id = value.declarations[0].initializer?.getText() || ""
    })

    if (!id.length) {
      throw new Error(`Couldn't find ID of ${type}: ${initializer.getText()}`)
    }

    return this.normalizeName(id)
  }

  private getValueFromReflection(
    refName: string,
    project: ProjectReflection
  ): string | undefined {
    // load it from the project
    const idVarReflection = project.getChildByName(refName)

    if (
      !idVarReflection ||
      !(idVarReflection instanceof DeclarationReflection) ||
      idVarReflection.type?.type !== "literal"
    ) {
      return
    }

    return idVarReflection.type.value as string
  }

  /**
   * Get the type of the step.
   *
   * @param initializer - The initializer of the step.
   * @returns The step's type.
   */
  getStepType(initializer: ts.CallExpression | ts.ArrowFunction): StepType {
    const stepText = this._getStepText(initializer)
    switch (stepText) {
      case "createWorkflow":
        return "workflowStep"
      case "createHook":
        return "hook"
      case "when":
        return "when"
      default:
        return "step"
    }
  }

  private _getStepText(
    initializer: ts.CallExpression | ts.ArrowFunction
  ): string {
    if (ts.isCallExpression(initializer)) {
      return initializer.expression.getText()
    }

    const callExpression = this.getCallExpressionFromBody(initializer.body)

    if (
      callExpression &&
      (!("symbol" in callExpression) || !callExpression.symbol)
    ) {
      // for arrow functions, the inner workflow / step isn't exported
      // so we have to rely on a hacky way of retrieving the text from the source file

      const sourceFile = initializer.getSourceFile()
      const localMap: Map<string, ts.Symbol> =
        "locals" in sourceFile
          ? (sourceFile.locals as Map<string, ts.Symbol>)
          : new Map()

      let text = ""
      const fnName = callExpression.expression.getText()
      localMap.forEach((value, key) => {
        if (text.length) {
          return
        }

        if (
          key === fnName &&
          value.declarations?.length &&
          "initializer" in value.declarations[0] &&
          ts.isCallExpression(value.declarations[0].initializer as ts.Node)
        ) {
          text = this._getStepText(
            value.declarations[0].initializer as ts.CallExpression
          )
        }
      })

      return text
    } else if (callExpression?.symbol) {
      return (
        (callExpression.symbol as ts.Symbol).declarations?.[0].getText() || ""
      )
    }

    return ""
  }

  /**
   * Get the modifier to use based on the step's type.
   *
   * @param initializer - The step's initializer.
   * @returns The step's modifier.
   */
  getModifier(stepType: StepType): StepModifier {
    return `@${stepType}`
  }

  generateHookExample({
    hookName,
    workflowName,
    parameter,
  }: {
    hookName: string
    workflowName: string
    parameter: ParameterReflection
  }): string {
    let str = `import { ${workflowName} } from "@medusajs/medusa/core-flows"\n\n`

    str += `${workflowName}.hooks.${hookName}(\n\t(async ({`

    if (
      parameter.type?.type === "reference" &&
      parameter.type.reflection instanceof DeclarationReflection &&
      parameter.type.reflection.children
    ) {
      parameter.type.reflection.children.forEach((childParam, index) => {
        if (index > 0) {
          str += `,`
        }

        str += ` ${childParam.name}`
      })
    }

    str += ` }, { container }) => {\n\t\t//TODO\n\t})\n)`

    return str
  }

  getCallExpressionFromBody(
    body: ts.ConciseBody
  ): ts.CallExpression | undefined {
    let callExpression: ts.CallExpression | undefined

    const checkChildren = (child: ts.Node) => {
      if (callExpression) {
        return
      } else if (ts.isCallExpression(child)) {
        callExpression = child
        return
      }

      if ("expression" in child) {
        checkChildren(child.expression as ts.Node)
      }
    }

    body.forEachChild(checkChildren)

    return callExpression
  }

  getIdentifierExpression(node: ts.Node): ts.Identifier | undefined {
    if (ts.isIdentifier(node)) {
      return node
    }

    if ("expression" in node) {
      return this.getIdentifierExpression(node.expression as ts.Node)
    }

    return
  }
}
