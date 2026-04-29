import {
  TransactionModelOptions,
  WorkflowHandler,
  WorkflowManager,
} from "@medusajs/orchestration"
import {
  IWorkflowEngineService,
  LoadedModule,
  MedusaContainer,
} from "@medusajs/types"
import {
  getCallerFilePath,
  isString,
  Modules,
  OrchestrationUtils,
  registerDevServerResource,
} from "@medusajs/utils"
import { ulid } from "ulid"
import { exportWorkflow, WorkflowResult } from "../../helper"
import { createStep } from "./create-step"
import { proxify } from "./helpers/proxy"
import { StepResponse } from "./helpers/step-response"
import { WorkflowResponse } from "./helpers/workflow-response"
import {
  CreateWorkflowComposerContext,
  HookHandler,
  ReturnWorkflow,
  StepExecutionContext,
  StepFunction,
  WorkflowData,
} from "./type"

global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext] = null

const buildTransactionId = (
  step: { __step__: string },
  stepContext: StepExecutionContext
) => {
  return (
    step.__step__ +
    "-" +
    (stepContext.transactionId ?? ulid()) +
    (stepContext.attempt > 1 ? `-attempt-${stepContext.attempt}` : "")
  )
}

/**
 * This function creates a workflow with the provided name and a constructor function.
 * The constructor function builds the workflow from steps created by the {@link createStep} function.
 * The returned workflow is an exported workflow of type {@link ReturnWorkflow}, meaning it's not executed right away. To execute it,
 * invoke the exported workflow, then run its `run` method.
 *
 * @typeParam TData - The type of the input passed to the composer function.
 * @typeParam TResult - The type of the output returned by the composer function.
 * @typeParam THooks - The type of hooks defined in the workflow.
 *
 * @returns The created workflow. You can later execute the workflow by invoking it, then using its `run` method.
 *
 * @example
 * import {
 *   createWorkflow,
 *   WorkflowResponse
 * } from "@medusajs/framework/workflows-sdk"
 * import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
 * import {
 *   createProductStep,
 *   getProductStep,
 * } from "./steps"
 *
 * interface WorkflowInput {
 *  title: string
 * }
 *
 * const myWorkflow = createWorkflow(
 *   "my-workflow",
 *   (input: WorkflowInput) => {
 *    // Everything here will be executed and resolved later
 *    // during the execution. Including the data access.
 *
 *     const product = createProductStep(input)
 *     return new WorkflowResponse(getProductStep(product.id))
 *   }
 * )
 *
 * export async function GET(
 *   req: MedusaRequest,
 *   res: MedusaResponse
 * ) {
 *   const { result: product } = await myWorkflow(req.scope)
 *     .run({
 *       input: {
 *         title: "Shirt"
 *       }
 *     })
 *
 *   res.json({
 *     product
 *   })
 * }
 */

export function createWorkflow<TData, TResult, THooks extends any[]>(
  /**
   * The name of the workflow or its configuration.
   */
  nameOrConfig: string | ({ name: string } & TransactionModelOptions),
  /**
   * The constructor function that is executed when the `run` method in {@link ReturnWorkflow} is used.
   * The function can't be an arrow function or an asynchronus function. It also can't directly manipulate data.
   * You'll have to use the {@link transform} function if you need to directly manipulate data.
   */
  composer: (
    input: WorkflowData<TData>
  ) => void | WorkflowResponse<TResult, THooks>
): ReturnWorkflow<TData, TResult, THooks> {
  const fileSourcePath = getCallerFilePath() as string
  const name = isString(nameOrConfig) ? nameOrConfig : nameOrConfig.name
  const options = isString(nameOrConfig) ? {} : nameOrConfig

  registerDevServerResource({
    sourcePath: fileSourcePath,
    id: name,
    type: "workflow",
  })

  const handlers: WorkflowHandler = new Map()

  let newWorkflow = false
  if (!WorkflowManager.getWorkflow(name)) {
    newWorkflow = true
    WorkflowManager.register(name, undefined, handlers, options)
  }

  const context: CreateWorkflowComposerContext = {
    __type: OrchestrationUtils.SymbolMedusaWorkflowComposerContext,
    workflowId: name,
    flow: WorkflowManager.getEmptyTransactionDefinition(),
    isAsync: false,
    handlers,
    overriddenHandler: new Map(),
    hooks_: {
      declared: [],
      registered: [],
    },
    hooksCallback_: {},
    stepConditions_: {},
    hookBinder: (name, fn) => {
      context.hooks_.declared.push(name)
      context.hooksCallback_[name] = fn.bind(context)()
    },
    stepBinder: (fn) => {
      return fn.bind(context)()
    },
    parallelizeBinder: (fn) => {
      return fn.bind(context)()
    },
  }

  global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext] = context

  const inputPlaceHolder = proxify<WorkflowData>({
    __type: OrchestrationUtils.SymbolInputReference,
    __step__: "",
    config: () => {
      // TODO: config default value?
      throw new Error("Config is not available for the input object.")
    },
  })

  const returnedStep = composer.apply(context, [inputPlaceHolder])

  delete global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext]

  if (newWorkflow) {
    WorkflowManager.update(name, context.flow, handlers, options)
  } else {
    WorkflowManager.register(name, context.flow, handlers, options)
  }

  const workflow = exportWorkflow<TData, TResult>(name, returnedStep, {
    wrappedInput: true,
    sourcePath: fileSourcePath,
  })

  const mainFlow = <TDataOverride = undefined, TResultOverride = undefined>(
    container?: LoadedModule[] | MedusaContainer
  ) => {
    const workflow_ = workflow<TDataOverride, TResultOverride>(container)
    const expandedFlow: any = workflow_
    expandedFlow.config = (config) => {
      workflow_.setOptions(config)
    }

    return expandedFlow
  }

  mainFlow.hooks = {} as Record<string, HookHandler>
  for (const hook of context.hooks_.declared) {
    mainFlow.hooks[hook] = context.hooksCallback_[hook].bind(context)
  }

  mainFlow.getName = () => name
  mainFlow.run = mainFlow().run
  mainFlow.runAsStep = ({
    input,
  }: {
    input: TData
  }): ReturnType<StepFunction<TData, TResult>> => {
    // Get current workflow composition context
    const workflowCompositionContext =
      global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext]

    const runAsAsync = workflowCompositionContext.isAsync || context.isAsync
    const step = createStep(
      {
        name: `${name}-as-step`,
        async: runAsAsync,
        nested: runAsAsync, // if async we flag this is a nested transaction
      },
      async (stepInput: TData, stepContext) => {
        const { container, ...sharedContext } = stepContext
        const isAsync = stepContext[" stepDefinition"]?.async

        const workflowEngine = container.resolve(Modules.WORKFLOW_ENGINE, {
          allowUnregistered: true,
        }) as IWorkflowEngineService

        const executionContext = {
          ...(sharedContext?.context ?? {}),
          transactionId: buildTransactionId(step, stepContext),
          parentStepIdempotencyKey: stepContext.idempotencyKey,
          preventReleaseEvents: true,
          runId: stepContext.runId,
        }

        let transaction
        if (workflowEngine && isAsync) {
          transaction = await workflowEngine.run(name, {
            input: stepInput as any,
            transactionId: executionContext.transactionId,
            context: executionContext,
            throwOnError: false,
            logOnError: true,
          })
        } else {
          transaction = await workflow.run({
            input: stepInput as any,
            container,
            context: executionContext,
          })
        }

        return new StepResponse(
          transaction.result,
          isAsync ? stepContext.transactionId : transaction
        )
      },
      async (transaction, stepContext) => {
        // The step itself has failed, there is nothing to revert

        const { container, ...sharedContext } = stepContext
        const isAsync = stepContext[" stepDefinition"]?.async

        const workflowEngine = container.resolve(Modules.WORKFLOW_ENGINE, {
          allowUnregistered: true,
        }) as IWorkflowEngineService

        const executionContext = {
          ...(sharedContext?.context ?? {}),
          transactionId: buildTransactionId(step, stepContext),
          parentStepIdempotencyKey: stepContext.idempotencyKey,
          preventReleaseEvents: true,
          cancelingFromParentStep: true,
        }

        if (workflowEngine && isAsync) {
          await workflowEngine.cancel(name, {
            transactionId: executionContext.transactionId,
            context: executionContext,
          })
        } else {
          await workflow(container).cancel({
            transaction: ((transaction as WorkflowResult<any>) ?? {})
              ?.transaction,
            transactionId: executionContext.transactionId,
            container,
            context: executionContext,
          })
        }

        return
      }
    )(input) as ReturnType<StepFunction<TData, TResult>>

    return step
  }

  return mainFlow as ReturnWorkflow<TData, TResult, THooks>
}
