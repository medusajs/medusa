import {
  OrchestratorBuilder,
  TransactionContext as OriginalWorkflowTransactionContext,
  TransactionPayload,
  TransactionStepsDefinition,
  WorkflowHandler,
} from "@medusajs/orchestration"
import { Context, MedusaContainer } from "@medusajs/types"

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
  hooks_: string[]
  hooksCallback_: Record<string, Function[]>
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  stepBinder: <TOutput = unknown>(
    fn: StepFunctionResult
  ) => WorkflowData<TOutput>
  hookBinder: <TOutput = unknown>(
    name: string,
    fn: Function
  ) => WorkflowData<TOutput>
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
}

export type WorkflowTransactionContext = StepExecutionContext &
  OriginalWorkflowTransactionContext & {
    invoke: { [key: string]: { output: any } }
  }
