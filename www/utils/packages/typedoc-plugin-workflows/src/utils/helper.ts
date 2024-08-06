import { DeclarationReflection, ProjectReflection } from "typedoc"
import ts from "typescript"
import { StepModifier, StepType } from "../types"

export default class Helper {
  normalizeName(name: string) {
    return name.replace(".runAsStep", "").replace(/^"/, "").replace(/"$/, "")
  }
  getReflectionSymbolAndInitializer({
    project,
    reflection,
  }: {
    project: ProjectReflection
    reflection: DeclarationReflection
  }) {
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

  getModifier(initializer: ts.CallExpression): StepModifier {
    const stepType = this.getStepType(initializer)

    return `@${stepType}`
  }
}
