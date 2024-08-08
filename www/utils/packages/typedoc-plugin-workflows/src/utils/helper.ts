import { DeclarationReflection, ProjectReflection } from "typedoc"
import ts from "typescript"
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
    return name.replace(".runAsStep", "").replace(/^"/, "").replace(/"$/, "")
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
    const idVar = initializer.arguments[0]
    const isWorkflowStep =
      checkWorkflowStep && this.getStepType(initializer) === "workflowStep"
    const idVarName = this.normalizeName(idVar.getText())

    // load it from the project
    const idVarReflection = project.getChildByName(idVarName)

    if (
      !idVarReflection ||
      !(idVarReflection instanceof DeclarationReflection) ||
      idVarReflection.type?.type !== "literal"
    ) {
      return
    }

    const stepId = idVarReflection.type.value as string

    return isWorkflowStep ? `${stepId}-as-step` : stepId
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
  getModifier(initializer: ts.CallExpression): StepModifier {
    const stepType = this.getStepType(initializer)

    return `@${stepType}`
  }
}
