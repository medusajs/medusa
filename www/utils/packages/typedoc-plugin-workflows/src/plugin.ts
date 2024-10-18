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
import { isWorkflow, isWorkflowStep } from "utils"
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
          context.project,
          "workflow"
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

        if (!reflection.comment && reflection.parent.comment) {
          reflection.comment = reflection.parent.comment
        }
      } else if (isWorkflowStep(reflection)) {
        if (!reflection.comment && reflection.parent.comment) {
          reflection.comment = reflection.parent.comment
        }
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
      const initializer = this.getInitializerOfNode(statement)

      if (!initializer) {
        return
      }

      const initializerName = this.helper.normalizeName(
        initializer.expression.getText()
      )

      if (initializerName === "when") {
        this.parseWhenStep({
          initializer,
          parentReflection,
          context,
          workflow,
          stepDepth,
        })
      } else {
        const steps = this.parseSteps({
          initializer,
          context,
          workflow,
          workflowVarName: parentReflection.name,
        })

        if (!steps.length) {
          return
        }

        steps.forEach((step) => {
          this.createStepDocumentReflection({
            ...step,
            depth: stepDepth,
            parentReflection,
          })
        })
      }

      stepDepth++
    })
  }

  /**
   * Parses steps in an initializer, retrieving each of their ID and reflection.
   *
   * @param param0 - The step's details.
   * @returns The step's ID and reflection, if found.
   */
  parseSteps({
    initializer,
    context,
    workflow,
    workflowVarName,
  }: {
    initializer: ts.CallExpression
    context: Context
    workflow?: WorkflowDefinition
    workflowVarName: string
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
            workflowVarName,
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
          workflowName: workflowVarName,
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
          "step",
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
   * Parses the step in a `when` condition, and creates a `when` document with the steps as child documents.
   *
   * @param param0 - The when stp's details.
   */
  parseWhenStep({
    initializer,
    parentReflection,
    context,
    workflow,
    stepDepth,
  }: {
    initializer: ts.CallExpression
    parentReflection: DeclarationReflection
    context: Context
    workflow?: WorkflowDefinition
    stepDepth: number
  }) {
    const whenInitializer = (initializer.expression as ts.CallExpression)
      .expression as ts.CallExpression
    const thenInitializer = initializer

    if (
      whenInitializer.arguments.length < 2 ||
      (!ts.isFunctionExpression(whenInitializer.arguments[1]) &&
        !ts.isArrowFunction(whenInitializer.arguments[1])) ||
      thenInitializer.arguments.length < 1 ||
      (!ts.isFunctionExpression(thenInitializer.arguments[0]) &&
        !ts.isArrowFunction(thenInitializer.arguments[0]))
    ) {
      return
    }

    const whenCondition = whenInitializer.arguments[1].body.getText()

    const thenStatements = (thenInitializer.arguments[0].body as ts.Block)
      .statements

    const documentReflection = new DocumentReflection(
      "when",
      parentReflection,
      [],
      {}
    )

    documentReflection.comment = new Comment()
    documentReflection.comment.modifierTags.add(this.helper.getModifier(`when`))
    documentReflection.comment.blockTags.push(
      new CommentTag(`@workflowDepth`, [
        {
          kind: "text",
          text: `${stepDepth}`,
        },
      ])
    )
    documentReflection.comment.blockTags.push(
      new CommentTag(`@whenCondition`, [
        {
          kind: "text",
          text: whenCondition,
        },
      ])
    )

    thenStatements.forEach((statement) => {
      const initializer = this.getInitializerOfNode(statement)

      if (!initializer) {
        return
      }

      this.parseSteps({
        initializer,
        context,
        workflow,
        workflowVarName: parentReflection.name,
      }).forEach((step) => {
        this.createStepDocumentReflection({
          ...step,
          depth: stepDepth,
          parentReflection: documentReflection,
        })
      })
    })

    if (documentReflection.children?.length) {
      parentReflection.documents?.push(documentReflection)
    }
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
    workflowName,
  }: {
    stepId: string
    context: Context
    inputSymbol: ts.Symbol
    workflowName: string
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

    declarationReflection.comment.blockTags.push(
      new CommentTag(`@example`, [
        {
          kind: "code",
          text: this.helper.generateHookExample({
            hookName: stepId,
            workflowName,
            parameter,
          }),
        },
      ])
    )

    return declarationReflection
  }

  /**
   * Creates a document reflection for a step.
   *
   * @param param0 - The step's details.
   */
  createStepDocumentReflection({
    stepType,
    stepReflection,
    depth,
    parentReflection,
  }: ParsedStep & {
    depth: number
    parentReflection: DeclarationReflection | DocumentReflection
  }) {
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
          text: `${depth}`,
        },
      ])
    )

    if (parentReflection.isDocument()) {
      parentReflection.addChild(documentReflection)
    } else {
      parentReflection.documents?.push(documentReflection)
    }
  }

  /**
   * Gets the initializer in a node, if available.
   *
   * @param node - The node to search for an initializer in.
   * @returns The initializer, if found.
   */
  getInitializerOfNode(node: ts.Node): ts.CallExpression | undefined {
    let initializer: ts.CallExpression | undefined
    switch (node.kind) {
      case SyntaxKind.CallExpression:
        initializer = node as ts.CallExpression
        break
      case SyntaxKind.VariableStatement:
        const variableInitializer = (node as VariableStatement).declarationList
          .declarations[0].initializer

        if (!variableInitializer) {
          return
        }

        initializer = this.findCallExpression(variableInitializer)
        break
      case SyntaxKind.ExpressionStatement:
        const statementInitializer = (node as ts.ExpressionStatement).expression

        initializer = this.findCallExpression(statementInitializer)
        break
      case SyntaxKind.ReturnStatement:
        let returnInitializer = (node as ts.ReturnStatement).expression

        if (
          returnInitializer &&
          ts.isNewExpression(returnInitializer) &&
          returnInitializer.expression.getText().includes("WorkflowResponse") &&
          returnInitializer.arguments?.length
        ) {
          returnInitializer = this.getInitializerOfNode(
            returnInitializer.arguments[0]
          )
        }

        if (!returnInitializer) {
          return
        }

        initializer = this.findCallExpression(returnInitializer)

        break
    }

    return initializer ? this.cleanUpInitializer(initializer) : undefined
  }

  /**
   * Finds a `CallExpression` in an expression and returns it, if available.
   *
   * @param expression - The expression to search in.
   * @param skipCallCheck - Whether to skip the `CallExpression` check the first time. Useful for the {@link cleanUpInitializer} method.
   * @returns The `CallExpression` if found.
   */
  findCallExpression(
    expression: ts.Expression,
    skipCallCheck = false
  ): ts.CallExpression | undefined {
    let initializer = expression
    while (
      (skipCallCheck || !ts.isCallExpression(initializer)) &&
      "expression" in initializer
    ) {
      initializer = initializer.expression as ts.Expression
      skipCallCheck = false
    }

    return initializer && ts.isCallExpression(initializer)
      ? initializer
      : undefined
  }

  /**
   * Finds an inner call expression of a call expression, if the provided one is not allowed.
   * This is useful for steps that chain a `.config` method, for example.
   *
   * @param initializer - The call expression to search in.
   * @returns The call expression to be used.
   */
  cleanUpInitializer(initializer: ts.CallExpression): ts.CallExpression {
    if (!("name" in initializer.expression)) {
      return initializer
    }

    const initializerName = (initializer.expression.name as ts.Identifier)
      .escapedText

    if (initializerName === "config") {
      return this.findCallExpression(initializer, true) || initializer
    }

    return initializer
  }
}

export default WorkflowsPlugin
