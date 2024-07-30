import {
  LocalWorkflow,
  OrchestratorBuilder,
  TransactionContext as OriginalWorkflowTransactionContext,
  TransactionModelOptions,
  TransactionPayload,
  TransactionStepsDefinition,
  WorkflowHandler,
} from "@medusajs/orchestration"
import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"
import { ExportedWorkflow } from "../../helper"
import { Hook } from "./create-hook"

export type StepFunctionResult<TOutput extends unknown | unknown[] = unknown> =
  (this: CreateWorkflowComposerContext) => WorkflowData<TOutput>

type StepFunctionReturnConfig<TOutput> = {
  config(
    config: { name?: string } & Omit<
      TransactionStepsDefinition,
      "next" | "uuid" | "action"
    >
  ): WorkflowData<TOutput>
}

type KeysOfUnion<T> = T extends T ? keyof T : never

/**
 * Helper to convert an array of hooks to functions
 */
type ConvertHooksToFunctions<THooks extends any[]> = {
  [K in keyof THooks]: THooks[K] extends Hook<infer Name, infer Input>
    ? {
        [Fn in Name]: (callback: (input: Input) => any) => void
      }
    : never
}[number]

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
      (): WorkflowData<TOutput> & StepFunctionReturnConfig<TOutput>
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
  ? Array<Item | WorkflowData<Item>>
  : T extends object
  ? {
      [Key in keyof T]: T[Key] | WorkflowData<T[Key]>
    }
  : T & WorkflowDataProperties<T>) &
  T &
  WorkflowDataProperties<T> & {
    config(
      config: { name?: string } & Omit<
        TransactionStepsDefinition,
        "next" | "uuid" | "action"
      >
    ): WorkflowData<T>
  }

export type CreateWorkflowComposerContext = {
  __type: string
  hooks_: {
    declared: string[]
    registered: string[]
  }
  hooksCallback_: Record<string, any>
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  stepBinder: <TOutput = unknown>(
    fn: StepFunctionResult
  ) => WorkflowData<TOutput>
  // TODO change the typings
  hookBinder: (name: string, fn: Function) => any
  parallelizeBinder: <TOutput extends WorkflowData[] = WorkflowData[]>(
    fn: (this: CreateWorkflowComposerContext) => TOutput
  ) => TOutput
}

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
  metadata: TransactionPayload["metadata"]
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
}

export type WorkflowTransactionContext = StepExecutionContext &
  OriginalWorkflowTransactionContext & {
    invoke: { [key: string]: { output: any } }
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
  ): Omit<
    LocalWorkflow,
    "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"
  > &
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>
} & {
  runAsStep: ({
    input,
  }: {
    input: TData | WorkflowData<TData>
  }) => ReturnType<StepFunction<TData, TResult>>
  run: <TDataOverride = undefined, TResultOverride = undefined>(
    ...args: Parameters<
      ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["run"]
    >
  ) => ReturnType<
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>["run"]
  >
  getName: () => string
  config: (config: TransactionModelOptions) => void
  hooks: ConvertHooksToFunctions<THooks>
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
