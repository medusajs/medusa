import {
  IWorkflowEngineService,
  LoadedModule,
  MedusaContainer,
  WorkflowConfigOptions,
} from "@medusajs/types"
import {
  getCallerFilePath,
  isString,
  MedusaError,
  OrchestrationUtils,
  registerDevServerResource,
} from "@medusajs/utils"
import { ulid } from "ulid"
import { brandWorkflow } from "../../brand"
import {
  getComposerContext,
  setComposerContext,
  WorkflowRecorder,
} from "../../compiler/recorder"
import { toDefinition } from "../../compiler/to-definition"
import { WorkflowResult } from "../../helper"
import {
  createWorkflowRunner,
  resolveWorkflowEngine,
} from "../../helper/runner"
import { createStep } from "./create-step"
import { proxify } from "./helpers/proxy"
import { StepResponse } from "./helpers/step-response"
import { WorkflowResponse } from "./helpers/workflow-response"
import {
  HookHandler,
  ReturnWorkflow,
  StepExecutionContext,
  StepFunction,
  WorkflowData,
} from "./type"

// An async child keeps the same id across invoke and compensation, whose
// attempts are counted separately: a retried attempt starts a new run under it
// once the failed one has finished. A sync child is retried with a fresh run
// per attempt and cancelled by its stored id.
const buildTransactionId = (
  step: { __step__: string },
  stepContext: StepExecutionContext,
  isAsync?: boolean
) => {
  return (
    step.__step__ +
    "-" +
    (stepContext.transactionId ?? ulid()) +
    (!isAsync && stepContext.attempt > 1
      ? `-attempt-${stepContext.attempt}`
      : "")
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
  nameOrConfig: string | ({ name: string } & WorkflowConfigOptions),
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
  const options: WorkflowConfigOptions = isString(nameOrConfig)
    ? {}
    : { ...nameOrConfig }
  delete (options as { name?: string }).name

  registerDevServerResource({
    sourcePath: fileSourcePath,
    id: name,
    type: "workflow",
  })

  const recorder = new WorkflowRecorder(name)
  const outerContext = getComposerContext()
  setComposerContext(recorder)

  let returned: unknown
  try {
    const inputPlaceHolder = proxify<WorkflowData>({
      __type: OrchestrationUtils.SymbolInputReference,
      __step__: "",
      config: () => {
        throw new Error("Config is not available for the input object.")
      },
    })

    returned = composer.apply(recorder, [inputPlaceHolder])
  } finally {
    setComposerContext(outerContext)
  }

  if (recorder.openConditions) {
    throw new Error(
      `Workflow "${name}": ".then" is missing after "when" condition`
    )
  }

  const definition = toDefinition({
    recorder,
    options,
    returned,
    hooks: (hookName) => recorder.hookHandlers.get(hookName),
  })

  // Workflow-level options set with `.config()`, applied to every run.
  const runOptions: WorkflowConfigOptions = {}
  const runnerFor = (container?: LoadedModule[] | MedusaContainer) => {
    const runner = createWorkflowRunner(mainFlow, container)
    if (Object.keys(runOptions).length) {
      runner.config(runOptions)
    }
    return runner
  }

  const mainFlow: any = (container?: LoadedModule[] | MedusaContainer) =>
    runnerFor(container)

  mainFlow.hooks = recorder.hooks as Record<string, HookHandler>

  mainFlow.getName = () => name
  mainFlow.run = (args?: any) => runnerFor().run(args)
  mainFlow.config = (config: WorkflowConfigOptions) => {
    Object.assign(runOptions, config)
  }

  mainFlow.runAsStep = ({
    input,
  }: {
    input: TData
  }): ReturnType<StepFunction<TData, TResult>> => {
    const parentRecorder = getComposerContext()
    if (!parentRecorder) {
      throw new Error(
        "runAsStep must be used inside a createWorkflow definition"
      )
    }

    parentRecorder.children.add(mainFlow)
    const runAsAsync = parentRecorder.isAsync || recorder.isAsync
    const step = createStep(
      {
        name: `${name}-as-step`,
        async: runAsAsync,
        nested: runAsAsync, // if async we flag this is a nested transaction
      },
      async (stepInput: TData, stepContext) => {
        const { container, ...sharedContext } = stepContext
        const isAsync = stepContext[" stepDefinition"]?.async

        const workflowEngine = resolveWorkflowEngine(
          container,
          name
        ) as IWorkflowEngineService

        const executionContext = {
          ...(sharedContext?.context ?? {}),
          transactionId: buildTransactionId(step, stepContext, isAsync),
          parentStepIdempotencyKey: stepContext.idempotencyKey,
          preventReleaseEvents: true,
          runId: stepContext.runId,
        }

        if (isAsync) {
          // The engine completes this step when the child finishes.
          try {
            await workflowEngine.run(mainFlow, {
              input: stepInput as any,
              transactionId: executionContext.transactionId,
              context: executionContext,
              throwOnError: false,
              logOnError: true,
              container,
            })
          } catch (error) {
            // A retried attempt keeps waiting on the child already running.
            if ((error as MedusaError)?.type !== MedusaError.Types.CONFLICT) {
              throw error
            }
          }
          return
        }

        const transaction = (await workflowEngine.run(mainFlow, {
          input: stepInput as any,
          context: executionContext,
          container,
        })) as WorkflowResult<TResult>

        // Only what cancel needs, since compensation input may be stored.
        const child = transaction.transaction
        return new StepResponse(transaction.result, {
          transactionId: child?.transactionId ?? executionContext.transactionId,
          snapshot: (child as { snapshot?: unknown } | undefined)?.snapshot,
        })
      },
      async (child, stepContext) => {
        const { container, ...sharedContext } = stepContext
        const isAsync = stepContext[" stepDefinition"]?.async

        // A child that failed has already compensated itself.
        if (!isAsync && !child) {
          return
        }

        const workflowEngine = resolveWorkflowEngine(
          container,
          name
        ) as IWorkflowEngineService

        const executionContext = {
          ...(sharedContext?.context ?? {}),
          transactionId: buildTransactionId(step, stepContext, isAsync),
          parentStepIdempotencyKey: stepContext.idempotencyKey,
          preventReleaseEvents: true,
          cancelingFromParentStep: true,
        }

        await workflowEngine.cancel(mainFlow, {
          transaction:
            isAsync || !child?.snapshot
              ? undefined
              : ({ snapshot: child.snapshot } as any),
          transactionId: isAsync
            ? executionContext.transactionId
            : child?.transactionId ?? executionContext.transactionId,
          context: executionContext,
          container,
        })
      }
    )(input) as ReturnType<StepFunction<TData, TResult>>

    return step
  }

  brandWorkflow(mainFlow, definition, recorder.children, runOptions)

  return mainFlow as ReturnWorkflow<TData, TResult, THooks>
}
