import {
  Context,
  LoadedModule,
  MedusaContainer,
  WorkflowConfigOptions,
  WorkflowStepConfig,
  WorkflowTypesKey,
} from "@medusajs/types"
import type { WorkflowRecorder } from "../../compiler/recorder"
import { ExportedWorkflow } from "../../helper"
import { Hook } from "./create-hook"
import { CompensateFn, InvokeFn } from "./create-step"

export type StepFunctionResult<TOutput extends unknown | unknown[] = unknown> =
  (this: CreateWorkflowComposerContext) => WorkflowData<TOutput>

export type StepFunctionReturnConfig<TOutput> = {
  config(config: { name?: string } & WorkflowStepConfig): WorkflowData<TOutput>
}

type KeysOfUnion<T> = T extends T ? keyof T : never
export type HookHandler = (...args: any[]) => void | Promise<void>

type ConvertHookToObject<THook> = THook extends Hook<
  infer Name,
  infer Input,
  infer Output
>
  ? {
      [K in Name]: <TCompensateInput>(
        invoke: InvokeFn<Input, Output, TCompensateInput>,
        compensate?: CompensateFn<TCompensateInput>
      ) => void
    }
  : never

/**
 * Helper to convert an array of hooks to functions
 */
type ConvertHooksToFunctions<THooks extends any[]> = THooks extends [
  infer A,
  ...infer R
]
  ? ConvertHookToObject<A> & ConvertHooksToFunctions<R>
  : {}

export type Void = { " $$type": "void" }

/**
 * A step function to be used in a workflow.
 *
 * @typeParam TInput - The type of the input of the step.
 * @typeParam TOutput - The type of the output of the step.
 */
export type StepFunction<
  TInput,
  TOutput = unknown
> = (KeysOfUnion<TInput> extends []
  ? // Function that doesn't expect any input
    {
      (): TOutput & {} extends never
        ? WorkflowData<Void> & StepFunctionReturnConfig<TOutput>
        : WorkflowData<TOutput> & StepFunctionReturnConfig<TOutput>
    }
  : // function that expects an input object
    {
      (input: WorkflowData<TInput> | TInput): WorkflowData<TOutput> &
        StepFunctionReturnConfig<TOutput>
    }) &
  WorkflowDataProperties<TOutput>

export type WorkflowDataProperties<T = unknown> = {
  __type: string
  __step__: string
}

/**
 * This type is used to encapsulate the input or output type of all utils.
 *
 * @typeParam T - The type of a step's input or result.
 */
export type WorkflowData<T = unknown> = (T extends Array<infer Item>
  ? Array<Item>
  : T) &
  WorkflowDataProperties<T> & {
    config(config: { name?: string } & WorkflowStepConfig): WorkflowData<T>
  }

export type CreateWorkflowComposerContext = WorkflowRecorder

/**
 * The step's context.
 */
export interface StepExecutionContext {
  /**
   * The ID of the workflow.
   */
  workflowId: string

  /**
   * The attempt number of the step.
   */
  attempt: number

  /**
   * The idempoency key of the step.
   */
  idempotencyKey: string

  /**
   * The idempoency key of the parent step.
   */
  parentStepIdempotencyKey?: string

  /**
   * Whether to prevent release events.
   */
  preventReleaseEvents?: boolean

  /**
   * The name of the step.
   */
  stepName: string

  /**
   * The action of the step.
   */
  action: "invoke" | "compensate"

  /**
   * The container used to access resources, such as services, in the step.
   */
  container: MedusaContainer
  /**
   * Metadata passed in the input.
   */
  metadata: {
    model_id: string
    idempotency_key: string
    action: string
    action_type: "invoke" | "compensate"
    attempt: number
    timestamp: number
  }
  /**
   * {@inheritDoc types!Context}
   */
  context: Context
  /**
   * A string indicating the ID of the group to aggregate the events to be emitted at a later point.
   */
  eventGroupId?: string
  /**
   * A string indicating the ID of the current transaction.
   */
  transactionId?: string

  /**
   * A string indicating the ID of the current run.
   */
  runId?: string

  /**
   * Get access to the result returned by a named step. Returns undefined
   * when step is not found or when nothing was returned.
   *
   * Adding a space hides the method from the autocomplete
   */
  " getStepResult"(stepId: string, action?: "invoke" | "compensate"): any

  /**
   * Get access to the definition of the step.
   */
  " stepDefinition": WorkflowStepConfig & { action: string }
}

export type WorkflowTransactionContext = StepExecutionContext & {
  payload?: unknown
  /**
   * The output of each step that has run, by step id.
   */
  invoke: { [key: string]: any }
  /**
   * @deprecated Not set.
   */
  compensate: { [key: string]: unknown }
}

/**
 * An exported workflow, which is the type of a workflow constructed by the {@link createWorkflow} function. The exported workflow can be invoked to create
 * an executable workflow, optionally within a specified container. So, to execute the workflow, you must invoke the exported workflow, then run the
 * `run` method of the exported workflow.
 *
 * @example
 * To execute a workflow:
 *
 * ```ts
 * myWorkflow()
 *   .run({
 *     input: {
 *       name: "John"
 *     }
 *   })
 *   .then(({ result }) => {
 *     console.log(result)
 *   })
 * ```
 *
 * To specify the container of the workflow, you can pass it as an argument to the call of the exported workflow. This is necessary when executing the workflow
 * within a Medusa resource such as an API Route or a Subscriber.
 *
 * For example:
 *
 * ```ts
 * import type {
 *   MedusaRequest,
 *   MedusaResponse
 * } from "@medusajs/medusa";
 * import myWorkflow from "../../../workflows/hello-world";
 *
 * export async function GET(
 *   req: MedusaRequest,
 *   res: MedusaResponse
 * ) {
 *   const { result } = await myWorkflow(req.scope)
 *     .run({
 *       input: {
 *         name: req.query.name as string
 *       }
 *     })
 *
 *   res.send(result)
 * }
 * ```
 */
export type ReturnWorkflow<TData, TResult, THooks extends any[]> = {
  <TDataOverride = undefined, TResultOverride = undefined>(
    container?: LoadedModule[] | MedusaContainer
  ): ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride> & {
    config: (config: WorkflowConfigOptions) => void
  }
} & {
  /**
   * This method executes the workflow as a step. Useful when running a workflow within another.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/learn/fundamentals/workflows/execute-another-workflow).
   *
   * @param param0 - The options to execute the workflow.
   * @returns The workflow's result
   */
  runAsStep: ({
    input,
  }: {
    /**
     * The workflow's input.
     */
    input: TData | WorkflowData<TData>
  }) => ReturnType<StepFunction<TData, TResult>>
  /**
   * This method executes a workflow.
   *
   * @param args - The options to execute the workflow.
   * @returns Details of the workflow's execution, including its result.
   */
  run: <TDataOverride = undefined, TResultOverride = undefined>(
    ...args: Parameters<
      ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["run"]
    >
  ) => ReturnType<
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["run"]
  >
  /**
   * This method retrieves the workflow's name.
   */
  getName: () => string
  /**
   * This method sets the workflow's configurations.
   */
  config: (config: WorkflowConfigOptions) => void
  /**
   * The workflow's exposed hooks, used to register a handler to consume the hook.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks#how-to-consume-a-hook).
   */
  hooks: ConvertHooksToFunctions<THooks>
} & {
  /**
   * Type-only. Carries the workflow's input and result types, so the workflow
   * engine module's `run` can infer them from the workflow.
   *
   * @ignore
   */
  [K in WorkflowTypesKey]?: { input: TData; result: TResult }
}

/**
 * Extract the raw type of the expected input data of a workflow.
 *
 * @example
 * type WorkflowInputData = UnwrapWorkflowInputDataType<typeof myWorkflow>
 */
export type UnwrapWorkflowInputDataType<
  T extends ReturnWorkflow<any, any, any>
> = T extends ReturnWorkflow<infer TData, infer R, infer THooks> ? TData : never
