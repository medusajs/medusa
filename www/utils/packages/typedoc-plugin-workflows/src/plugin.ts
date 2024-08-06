import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ProjectReflection,
  ReflectionKind,
  SignatureReflection,
} from "typedoc"
import ts, { SyntaxKind, VariableStatement } from "typescript"
import { WorkflowManager } from "@medusajs/orchestration"

class WorkflowsPlugin {
  protected app: Application

  constructor(app: Application) {
    this.app = app

    this.registerOptions()
    this.registerEventHandlers()
  }

  registerOptions() {
    this.app.options.addDeclaration({
      name: "enableWorkflowsPlugins",
      help: "Whether to enable the workflows plugin.",
      type: ParameterType.Boolean, // The default
      defaultValue: false,
    })
  }

  registerEventHandlers() {
    this.app.converter.on(
      Converter.EVENT_RESOLVE_BEGIN,
      this.handleDeclarationCreated.bind(this)
    )
  }

  handleDeclarationCreated(context: Context) {
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      if (!(reflection instanceof SignatureReflection)) {
        continue
      }

      if (reflection.name === "createProductsWorkflow") {
        const { initializer } =
          this.getReflectionSymbolAndInitializer({
            project: context.project,
            reflection: reflection.parent,
          }) || {}

        if (!initializer) {
          return
        }

        const workflowId = this.getStepOrWorkflowId(
          initializer,
          context.project
        )

        if (!workflowId) {
          continue
        }

        this.parseSteps({
          workflowId,
          constructorFn: initializer.arguments[1] as ts.ArrowFunction,
          context,
        })
      }
    }
  }

  // TODO handle other function types
  parseSteps({
    workflowId,
    constructorFn,
    context,
  }: {
    workflowId: string
    constructorFn: ts.ArrowFunction
    context: Context
  }) {
    // use the workflow manager to check whether something in the constructor
    // body is a step/hook
    const workflow = WorkflowManager.getWorkflow(workflowId)

    if (!ts.isBlock(constructorFn.body)) {
      return
    }

    constructorFn.body.statements.forEach((statement) => {
      switch (statement.kind) {
        case SyntaxKind.VariableStatement:
          const variableInitializer = (statement as VariableStatement)
            .declarationList.declarations[0].initializer

          if (
            !variableInitializer ||
            !ts.isCallExpression(variableInitializer)
          ) {
            return
          }

          const initializerName = variableInitializer.expression.getText()

          const initializerReflection =
            context.project.getChildByName(initializerName)

          if (
            !initializerReflection ||
            !(initializerReflection instanceof DeclarationReflection)
          ) {
            return
          }

          const { initializer } =
            this.getReflectionSymbolAndInitializer({
              project: context.project,
              reflection: initializerReflection,
            }) || {}

          if (!initializer) {
            return
          }

          // TODO remove .runAsStep from name
          const stepId = this.getStepOrWorkflowId(initializer, context.project)

          // check if is a step in the workflow
          if (!stepId || !workflow?.handlers_.get(stepId)) {
            return
          }

          // TODO check if it's a step, hook, or another workflow
          console.log(variableInitializer)
          return
        case SyntaxKind.ExpressionStatement:
          return
      }
    })
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
    project: ProjectReflection
  ): string | undefined {
    const workflowIdVarName = initializer.arguments[0]

    // load it from the project
    const workflowIdReflection = project.getChildByName(
      workflowIdVarName.getText()
    )

    if (
      !workflowIdReflection ||
      !(workflowIdReflection instanceof DeclarationReflection) ||
      workflowIdReflection.type?.type !== "literal"
    ) {
      return
    }

    return workflowIdReflection.type.value as string
  }
}

export default WorkflowsPlugin
