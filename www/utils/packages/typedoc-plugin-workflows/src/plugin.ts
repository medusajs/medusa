import {
  Application,
  Comment,
  CommentTag,
  Context,
  Converter,
  DeclarationReflection,
  DocumentReflection,
  ParameterReflection,
  ParameterType,
  ReferenceType,
  ReflectionKind,
  SignatureReflection,
} from "typedoc"
import ts, { SyntaxKind, VariableStatement } from "typescript"
import { WorkflowManager, WorkflowDefinition } from "@medusajs/orchestration"
import Helper from "./utils/helper"
import { isWorkflow } from "utils"
import { StepType } from "./types"

type ParsedStep = {
  stepReflection: DeclarationReflection
  stepType: StepType
}

/**
 * A plugin that extracts a workflow's steps, hooks, their types, and attaches them as
 * documents to the workflow's reflection.
 */
class WorkflowsPlugin {
  protected app: Application
  protected helper: Helper

  constructor(app: Application) {
    this.app = app
    this.helper = new Helper()

    this.registerOptions()
    this.registerEventHandlers()
  }

  /**
   * Register the plugin's options.
   */
  registerOptions() {
    this.app.options.addDeclaration({
      name: "enableWorkflowsPlugins",
      help: "Whether to enable the workflows plugin.",
      type: ParameterType.Boolean, // The default
      defaultValue: false,
    })
  }

  /**
   * Register event handlers.
   */
  registerEventHandlers() {
    this.app.converter.on(
      Converter.EVENT_RESOLVE_BEGIN,
      this.handleResolve.bind(this)
    )
  }

  /**
   * When the converter begins resolving a project, this method is triggered. It finds
   * all signatures that are workflows and attaches the necessary information to them.
   *
   * @param context - The project's context.
   */
  handleResolve(context: Context) {
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      if (!(reflection instanceof SignatureReflection)) {
        continue
      }

      if (isWorkflow(reflection)) {
        const { initializer } =
          this.helper.getReflectionSymbolAndInitializer({
            project: context.project,
            reflection: reflection.parent,
          }) || {}

        if (
          !initializer ||
          (!ts.isArrowFunction(initializer.arguments[1]) &&
            !ts.isFunctionExpression(initializer.arguments[1]))
        ) {
          continue
        }

        const workflowId = this.helper.getStepOrWorkflowId(
          initializer,
          context.project
        )

        if (!workflowId) {
          continue
        }

        this.parseWorkflow({
          workflowId,
          constructorFn: initializer.arguments[1],
          context,
          parentReflection: reflection.parent,
        })
      }
    }
  }

  /**
   * Parse the steps of a workflow and attach them as documents to the parent reflection.
   *
   * @param param0 - The workflow's details.
   */
  parseWorkflow({
    workflowId,
    constructorFn,
    context,
    parentReflection,
  }: {
    workflowId: string
    constructorFn: ts.ArrowFunction | ts.FunctionExpression
    context: Context
    parentReflection: DeclarationReflection
  }) {
    // use the workflow manager to check whether something in the constructor
    // body is a step/hook
    const workflow = WorkflowManager.getWorkflow(workflowId)

    if (!ts.isBlock(constructorFn.body)) {
      return
    }

    if (!parentReflection.documents) {
      parentReflection.documents = []
    }

    let stepDepth = 1

    constructorFn.body.statements.forEach((statement) => {
      const initializer = this.getInitializerOfStatement(statement)

      if (!initializer) {
        return
      }

      const steps = this.parseSteps({
        initializer,
        context,
        workflow,
      })

      if (!steps.length) {
        return
      }

      steps.forEach(({ stepType, stepReflection }) => {
        const stepModifier = this.helper.getModifier(stepType)

        const documentReflection = new DocumentReflection(
          stepReflection.name,
          stepReflection,
          [],
          {}
        )

        documentReflection.comment = new Comment()
        documentReflection.comment.modifierTags.add(stepModifier)
        documentReflection.comment.blockTags.push(
          new CommentTag(`@workflowDepth`, [
            {
              kind: "text",
              text: `${stepDepth}`,
            },
          ])
        )

        parentReflection.documents?.push(documentReflection)
      })

      stepDepth++
    })
  }

  /**
   * Parse a step to retrieve its ID and reflection.
   *
   * @param param0 - The step's details.
   * @returns The step's ID and reflection, if found.
   */
  parseSteps({
    initializer,
    context,
    workflow,
  }: {
    initializer: ts.CallExpression
    context: Context
    workflow?: WorkflowDefinition
  }): ParsedStep[] {
    const steps: ParsedStep[] = []
    const initializerName = this.helper.normalizeName(
      initializer.expression.getText()
    )

    if (initializerName === "parallelize") {
      if (!initializer.arguments.length) {
        return steps
      }

      initializer.arguments.forEach((argument) => {
        if (!ts.isCallExpression(argument)) {
          return
        }

        steps.push(
          ...this.parseSteps({
            initializer: argument,
            context,
            workflow,
          })
        )
      })
    } else {
      let stepId: string | undefined
      let stepReflection: DeclarationReflection | undefined
      let stepType = this.helper.getStepType(initializer)

      if (stepType === "hook" && "symbol" in initializer.arguments[1]) {
        // get the hook's name from the first argument
        stepId = this.helper.normalizeName(initializer.arguments[0].getText())
        stepReflection = this.assembleHookReflection({
          stepId,
          context,
          inputSymbol: initializer.arguments[1].symbol as ts.Symbol,
        })
      } else {
        const initializerReflection =
          context.project.getChildByName(initializerName)

        if (
          !initializerReflection ||
          !(initializerReflection instanceof DeclarationReflection)
        ) {
          return steps
        }

        const { initializer: originalInitializer } =
          this.helper.getReflectionSymbolAndInitializer({
            project: context.project,
            reflection: initializerReflection,
          }) || {}

        if (!originalInitializer) {
          return steps
        }

        stepId = this.helper.getStepOrWorkflowId(
          originalInitializer,
          context.project,
          true
        )
        stepType = this.helper.getStepType(originalInitializer)
        stepReflection = initializerReflection
      }

      // check if is a step in the workflow
      if (
        stepId &&
        stepType &&
        stepReflection &&
        workflow?.handlers_.get(stepId)
      ) {
        steps.push({
          stepReflection,
          stepType,
        })
      }
    }

    return steps
  }

  /**
   * This method creates a declaration reflection for a hook, since a hook doesn't have its own reflection.
   *
   * @param param0 - The hook's details.
   * @returns The hook's reflection
   */
  assembleHookReflection({
    stepId,
    context,
    inputSymbol,
  }: {
    stepId: string
    context: Context
    inputSymbol: ts.Symbol
  }): DeclarationReflection {
    const declarationReflection = context.createDeclarationReflection(
      ReflectionKind.Function,
      undefined,
      undefined,
      stepId
    )

    declarationReflection.comment = new Comment()
    declarationReflection.comment.summary = [
      {
        kind: "text",
        text: "This step is a hook that you can inject custom functionality into.",
      },
    ]
    const signatureReflection = new SignatureReflection(
      stepId,
      ReflectionKind.SomeSignature,
      declarationReflection
    )

    const parameter = new ParameterReflection(
      "input",
      ReflectionKind.Parameter,
      signatureReflection
    )

    parameter.type = ReferenceType.createSymbolReference(inputSymbol, context)

    if (parameter.type.name === "__object") {
      parameter.type.name = "object"
    }

    signatureReflection.parameters = []

    signatureReflection.parameters.push(parameter)

    declarationReflection.signatures = []

    declarationReflection.signatures.push(signatureReflection)

    return declarationReflection
  }

  getInitializerOfStatement(
    statement: ts.Statement
  ): ts.CallExpression | undefined {
    let initializer: ts.CallExpression | undefined
    switch (statement.kind) {
      case SyntaxKind.VariableStatement:
        const variableInitializer = (statement as VariableStatement)
          .declarationList.declarations[0].initializer

        if (variableInitializer && ts.isCallExpression(variableInitializer)) {
          initializer = variableInitializer
        }
        break
      case SyntaxKind.ExpressionStatement:
        const statementInitializer = (statement as ts.ExpressionStatement)
          .expression
        if (ts.isCallExpression(statementInitializer)) {
          initializer = statementInitializer
        }
        break
      case SyntaxKind.ReturnStatement:
        const returnInitializer = (statement as ts.ReturnStatement).expression

        if (returnInitializer && ts.isCallExpression(returnInitializer)) {
          initializer = returnInitializer
        }
        break
    }

    return initializer
  }
}

export default WorkflowsPlugin
