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
import Helper, { WORKFLOW_AS_STEP_SUFFIX } from "./utils/helper.js"
import {
  findReflectionInNamespaces,
  isWorkflow,
  isWorkflowStep,
  addTagsToReflection,
  getResolvedResourcesOfStep,
  getUniqueStrArray,
  getWorkflowInputType,
} from "utils"
import { StepType } from "./types.js"
import Examples from "./utils/examples.js"
import { MedusaEvent } from "types"
import path from "path"
import { readFileSync } from "fs"

type ParsedStep = {
  stepReflection: DeclarationReflection
  stepType: StepType
  resources: string[]
}

/**
 * A plugin that extracts a workflow's steps, hooks, their types, and attaches them as
 * documents to the workflow's reflection.
 */
class WorkflowsPlugin {
  protected app: Application
  protected helper: Helper
  protected examplesHelper: Examples
  protected workflowsTagsMap: Map<string, string[]>
  protected addTagsAfterParsing: {
    [k: string]: {
      id: string
      workflowIds: string[]
    }
  }
  protected events: MedusaEvent[] = []

  constructor(app: Application) {
    this.app = app
    this.helper = new Helper()
    this.examplesHelper = new Examples()
    this.workflowsTagsMap = new Map()
    this.addTagsAfterParsing = {}

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
    const isEnabled = this.app.options.getValue("enableWorkflowsPlugins")
    if (!isEnabled) {
      return
    }
    this.readEventsJson()
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      const isIgnored = reflection.comment?.modifierTags.has("@ignore")
      if (!(reflection instanceof SignatureReflection) || isIgnored) {
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
          !initializer.arguments ||
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
          workflowReflection: reflection,
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

    this.addTagsAfterParsingWorkflows(context)
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
    workflowReflection,
  }: {
    workflowId: string
    constructorFn: ts.ArrowFunction | ts.FunctionExpression
    context: Context
    parentReflection: DeclarationReflection
    workflowReflection: SignatureReflection
  }) {
    // use the workflow manager to check whether something in the constructor
    // body is a step/hook
    const workflow = WorkflowManager.getWorkflow(workflowId)
    const resources: string[] = []

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
        const { resources: whenResources } = this.parseWhenStep({
          initializer,
          parentReflection,
          context,
          workflow,
          stepDepth,
          workflowReflection,
          constructorFn,
        })
        resources.push(...whenResources)
      } else {
        const steps = this.parseSteps({
          initializer,
          context,
          workflow,
          workflowVarName: parentReflection.name,
          workflowReflection,
          workflowComments: parentReflection.comment?.blockTags,
          constructorFn,
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
          resources.push(...step.resources)
        })
      }

      stepDepth++
    })

    const uniqueResources = addTagsToReflection(parentReflection, [
      ...resources,
      "workflow",
    ])

    this.updateWorkflowsTagsMap(workflowId, uniqueResources)
    this.attachEvents(parentReflection)
    this.attachLocksInWorkflow({
      workflowReflection: parentReflection,
      context,
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
    workflowReflection,
    workflowComments = [],
    constructorFn,
  }: {
    initializer: ts.CallExpression
    context: Context
    workflow?: WorkflowDefinition
    workflowVarName: string
    workflowReflection: SignatureReflection
    workflowComments?: CommentTag[]
    constructorFn: ts.ArrowFunction | ts.FunctionExpression
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
            workflowReflection,
            workflowComments,
            constructorFn,
          })
        )
      })
    } else {
      let stepId: string | undefined
      let stepReflection: DeclarationReflection | undefined
      let stepType = this.helper.getStepType(initializer)
      const resources: string[] = []

      if (stepType === "hook" && "symbol" in initializer.arguments[1]) {
        // get the hook's name from the first argument
        stepId = this.helper.normalizeName(initializer.arguments[0].getText())
        const shouldIgnore = ts
          .getJSDocCommentsAndTags(initializer.parent)
          .some((comment) => {
            if (!("tags" in comment)) {
              return false
            }

            return comment.tags?.some(
              (tag) => tag.tagName.getText() === "ignore"
            )
          })
        if (!shouldIgnore) {
          const hookArgumetSymbol = this.getHookArgumentSymbol({
            argument: initializer.arguments[1],
            constructorFn,
          })

          if (hookArgumetSymbol) {
            stepReflection = this.assembleHookReflection({
              stepId,
              context,
              inputSymbol: hookArgumetSymbol,
              workflowName: workflowVarName,
              workflowComments,
              workflowReflection: workflowReflection.parent,
            })
          }
        }
      } else {
        const initializerReflection = findReflectionInNamespaces(
          context.project,
          initializerName
        )

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
        const stepResources = getResolvedResourcesOfStep(
          originalInitializer,
          stepId
        )

        resources.push(...stepResources)
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
          resources,
        })
        if (stepId?.endsWith(WORKFLOW_AS_STEP_SUFFIX)) {
          this.updateAddTagsAfterParsingMap(workflowReflection, {
            id: workflow.id,
            workflowId: stepId,
          })
        }
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
    workflowReflection,
    ...rest
  }: {
    initializer: ts.CallExpression
    parentReflection: DeclarationReflection
    context: Context
    workflow?: WorkflowDefinition
    stepDepth: number
    workflowReflection: SignatureReflection
    constructorFn: ts.ArrowFunction | ts.FunctionExpression
  }): {
    resources: string[]
  } {
    const resources: string[] = []
    const whenInitializer = (initializer.expression as ts.CallExpression)
      .expression as ts.CallExpression
    const thenInitializer = initializer

    const validArgumentsLength =
      whenInitializer.arguments.length === 2 ||
      whenInitializer.arguments.length === 3

    const conditionIndex = whenInitializer.arguments.length - 1

    if (
      !validArgumentsLength ||
      (!ts.isFunctionExpression(whenInitializer.arguments[conditionIndex]) &&
        !ts.isArrowFunction(whenInitializer.arguments[conditionIndex])) ||
      thenInitializer.arguments.length < 1 ||
      (!ts.isFunctionExpression(thenInitializer.arguments[0]) &&
        !ts.isArrowFunction(thenInitializer.arguments[0]))
    ) {
      return {
        resources,
      }
    }

    const whenCondition =
      whenInitializer.arguments[conditionIndex].body.getText()

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

    // Handles then with a single return statment rather than a block
    if (ts.isCallExpression(thenInitializer.arguments[0].body)) {
      this.parseSteps({
        initializer: thenInitializer.arguments[0].body,
        context,
        workflow,
        workflowVarName: parentReflection.name,
        workflowReflection,
        ...rest,
      }).forEach((step) => {
        this.createStepDocumentReflection({
          ...step,
          depth: stepDepth,
          parentReflection: documentReflection,
        })

        resources.push(...step.resources)
      })
    } else {
      const thenStatements = (thenInitializer.arguments[0].body as ts.Block)
        .statements

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
          workflowReflection,
          ...rest,
        }).forEach((step) => {
          this.createStepDocumentReflection({
            ...step,
            depth: stepDepth,
            parentReflection: documentReflection,
          })

          resources.push(...step.resources)
        })
      })
    }

    if (documentReflection.children?.length) {
      parentReflection.documents?.push(documentReflection)
    }

    return {
      resources: getUniqueStrArray(resources),
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
    workflowComments,
    workflowReflection,
  }: {
    stepId: string
    context: Context
    inputSymbol: ts.Symbol
    workflowName: string
    workflowComments?: CommentTag[]
    workflowReflection: DeclarationReflection
  }): DeclarationReflection {
    const hooksProperty = workflowReflection.getChildByName("hooks")
    let declarationReflection: DeclarationReflection | undefined
    if (
      hooksProperty?.isDeclaration() &&
      hooksProperty.type?.type === "intersection"
    ) {
      hooksProperty.type.types.some((hookType) => {
        if (hookType.type !== "reflection") {
          return
        }

        declarationReflection = hookType.declaration.children?.find((child) => {
          return child.name === stepId
        })

        return declarationReflection !== undefined
      })
    }
    if (!declarationReflection) {
      declarationReflection = context.createDeclarationReflection(
        ReflectionKind.Function,
        undefined,
        undefined,
        stepId
      )
    }

    declarationReflection.comment = new Comment()

    const hookComment = workflowComments?.find(
      (tag) => tag.tag === `@property` && tag.name === `hooks.${stepId}`
    )

    declarationReflection.comment.summary = hookComment?.content || [
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
    const isParameterWorkflowInput =
      inputSymbol.valueDeclaration?.kind === ts.SyntaxKind.Parameter &&
      workflowReflection.signatures?.length
    parameter.type = isParameterWorkflowInput
      ? getWorkflowInputType(workflowReflection.signatures![0]) ||
        ReferenceType.createSymbolReference(inputSymbol, context)
      : ReferenceType.createSymbolReference(inputSymbol, context)

    if (parameter.type.type === "reference") {
      if (parameter.type.name === "__object") {
        parameter.type.name = "object"
        parameter.type.qualifiedName = "object"

        if (!parameter.comment?.summary) {
          parameter.comment = new Comment()
          parameter.comment.summary = [
            {
              kind: "text",
              text: "The input data for the hook.",
            },
          ]
        }
      }

      if (parameter.type.reflection instanceof DeclarationReflection) {
        const additionalDataChild = parameter.type.reflection.children?.find(
          (child) => child.name === "additional_data"
        )

        if (additionalDataChild) {
          additionalDataChild.comment =
            additionalDataChild.comment || new Comment()
          additionalDataChild.comment.summary = [
            {
              kind: "text",
              text: "Additional data that can be passed through the `additional_data` property in HTTP requests.\nLearn more in [this documentation](https://docs.medusajs.com/learn/fundamentals/api-routes/additional-data).",
            },
          ]
        }
      }
    }

    signatureReflection.parameters = []

    signatureReflection.parameters.push(parameter)

    declarationReflection.signatures = []

    declarationReflection.signatures.push(signatureReflection)

    declarationReflection.comment.blockTags.push(
      new CommentTag(`@example`, [
        {
          kind: "code",
          text: this.examplesHelper.generateHookExample({
            hookName: stepId,
            workflowName,
            parameter,
          }),
        },
      ])
    )

    if (
      hooksProperty?.isDeclaration() &&
      hooksProperty.type?.type === "reflection"
    ) {
      hooksProperty.type.declaration.addChild(declarationReflection)
    }

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
    resources,
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
    const resourcesForType =
      stepType === "step" || stepType === "hook" ? [stepType] : []
    addTagsToReflection(stepReflection, [...resources, ...resourcesForType])

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

  updateAddTagsAfterParsingMap(
    reflection: SignatureReflection,
    {
      id,
      workflowId,
    }: {
      id: string
      workflowId: string
    }
  ) {
    const existingItem = this.addTagsAfterParsing[`${reflection.id}`] || {
      id,
      workflowIds: [],
    }
    existingItem.workflowIds.push(
      workflowId.replace(WORKFLOW_AS_STEP_SUFFIX, "")
    )
    this.addTagsAfterParsing[`${reflection.id}`] = existingItem
  }

  updateWorkflowsTagsMap(workflowId: string, tags: string[]) {
    const existingItems = this.workflowsTagsMap.get(workflowId) || []
    existingItems.push(...tags)
    this.workflowsTagsMap.set(workflowId, existingItems)
  }

  addTagsAfterParsingWorkflows(context: Context) {
    let keys = Object.keys(this.addTagsAfterParsing)

    const handleForWorkflow = (
      key: string,
      {
        id,
        workflowIds,
      }: {
        id: string
        workflowIds: string[]
      }
    ) => {
      const resources: string[] = []
      workflowIds.forEach((workflowId) => {
        // check if it exists in keys
        const existingKey = keys.find(
          (k) => this.addTagsAfterParsing[k].id === workflowId
        )
        if (existingKey) {
          handleForWorkflow(existingKey, this.addTagsAfterParsing[existingKey])
        }
        resources.push(...(this.workflowsTagsMap.get(workflowId) || []))
      })

      const reflection = context.project.getReflectionById(parseInt(key))
      if (reflection) {
        const uniqueTags = addTagsToReflection(reflection, resources)
        this.updateWorkflowsTagsMap(id, uniqueTags)
      }
      delete this.addTagsAfterParsing[key]
      keys = Object.keys(this.addTagsAfterParsing)
    }

    do {
      handleForWorkflow(keys[0], this.addTagsAfterParsing[keys[0]])
    } while (keys.length > 0)
  }

  getHookArgumentSymbol({
    argument,
    constructorFn,
  }: {
    argument: ts.Node
    constructorFn: ts.ArrowFunction | ts.FunctionExpression
  }): ts.Symbol | undefined {
    if ("symbol" in argument && argument.symbol) {
      return argument.symbol as ts.Symbol
    }

    if (!("locals" in constructorFn) || !constructorFn.locals) {
      return undefined
    }

    // try to retrieve from the locals in the constructor function
    return (constructorFn.locals as Map<string, ts.Symbol>).get(
      argument.getText()
    )
  }

  readEventsJson() {
    if (this.events.length) {
      return
    }

    const eventsPath = path.resolve(
      "..",
      "..",
      "generated",
      "events-output.json"
    )

    this.events = JSON.parse(readFileSync(eventsPath, "utf-8"))
  }

  attachEvents(workflowReflection: DeclarationReflection) {
    if (!workflowReflection.comment) {
      workflowReflection.comment = new Comment()
    }

    const eventsTag = workflowReflection.comment.blockTags.find(
      (tag) => tag.tag === "@workflowEvent"
    )

    if (eventsTag) {
      return
    }

    const workflowEvents = this.events.filter((event) =>
      event.workflows.includes(workflowReflection.name)
    )

    if (!workflowEvents) {
      return
    }

    workflowReflection.comment.blockTags.push(
      ...workflowEvents.map((event) => {
        let commentText = `${event.name} -- ${event.description} -- ${event.payload}`
        if (event.deprecated) {
          commentText += " -- deprecated"
          if (event.deprecated_message) {
            commentText += ` -- ${event.deprecated_message}`
          }
        }
        if (event.since) {
          commentText += ` -- since: ${event.since}`
        }
        return new CommentTag(`@workflowEvent`, [
          {
            kind: "text",
            text: commentText,
          },
        ])
      })
    )
  }

  attachLocksInWorkflow({
    workflowReflection,
    context,
  }: {
    workflowReflection: DeclarationReflection
    context: Context
  }) {
    const { initializer: workflowInitializer } =
      this.helper.getReflectionSymbolAndInitializer({
        project: context.project,
        reflection: workflowReflection,
      }) || {}
    // check if the workflow acquires a lock
    // for simplicity we'll assume the workflow acquires a lock
    // with acquireLockStep only once
    const checkHasAcquireLockStep = (
      documents: DocumentReflection[]
    ): boolean => {
      return documents.some((child) => {
        if (child.name === "acquireLockStep") {
          return true
        }

        if (child.children) {
          return checkHasAcquireLockStep(child.children)
        }
      })
    }

    const hasAcquireLockStep = checkHasAcquireLockStep(
      workflowReflection.documents || []
    )

    if (!hasAcquireLockStep) {
      return
    }

    // use regex to get acquireLockStep call
    const workflowText = workflowInitializer
      ? workflowInitializer.getText()
      : ""

    const acquireLockStepRegex = /acquireLockStep\s*\(\s*\{[\s\S]*?\}\s*\)/g

    // catch one match only
    const match = acquireLockStepRegex.exec(workflowText)

    if (!match) {
      return
    }

    // remove extra spaces after new lines
    const acquireLockStepCall = match[0]
      .replace(/\n\s\s/g, "")
      .replace(/\s{2,}/g, "  ")

    // extract the key
    const keyRegex = /key:\s*([^,}\n]+)/g
    const keyMatch = keyRegex.exec(acquireLockStepCall)

    if (!keyMatch) {
      return
    }

    const lockKey = keyMatch[1].trim()

    const comment = workflowReflection.comment || new Comment()

    comment.blockTags.push(
      new CommentTag(`@workflowLock`, [
        {
          kind: "text",
          text: `${lockKey} --- ${acquireLockStepCall}`,
        },
      ])
    )

    workflowReflection.comment = comment
  }
}

export default WorkflowsPlugin
