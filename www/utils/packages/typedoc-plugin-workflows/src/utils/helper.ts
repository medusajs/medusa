import {
  DeclarationReflection,
  ParameterReflection,
  ProjectReflection,
} from "typedoc"
import ts, { isStringLiteral } from "typescript"
import { StepModifier, StepType } from "../types"

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
    initializer: ts.CallExpression,
    project: ProjectReflection,
    checkWorkflowStep = false
  ): string | undefined {
    const idArg = initializer.arguments[0]
    const isWorkflowStep =
      checkWorkflowStep && this.getStepType(initializer) === "workflowStep"
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
    } else if (!isStringLiteral(idArg)) {
      stepId = this.getValueFromReflection(idArgValue, project)
    } else {
      stepId = idArgValue
    }

    return isWorkflowStep ? `${stepId}-as-step` : stepId
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
  getStepType(initializer: ts.CallExpression): StepType {
    switch (initializer.expression.getText()) {
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
    let str = `import { ${workflowName} } from "@medusajs/core-flows"\n\n`

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
}
