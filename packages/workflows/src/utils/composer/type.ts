import {
  OrchestratorBuilder,
  TransactionContext as OriginalWorkflowTransactionContext,
  TransactionPayload,
  WorkflowHandler,
} from "@medusajs/orchestration"
import { Context, MedusaContainer } from "@medusajs/types"

export type StepFunctionResult<TOutput extends unknown | unknown[] = unknown> =
  (this: CreateWorkflowComposerContext) => TOutput extends []
    ? [
        ...WorkflowData<{
          [K in keyof TOutput]: TOutput[number][K]
        }>[]
      ]
    : WorkflowData<{ [K in keyof TOutput]: TOutput[K] }>

export type StepFunction<TInput extends object = object, TOutput = unknown> = {
  (input: { [K in keyof TInput]: WorkflowData<TInput[K]> }): WorkflowData<{
    [K in keyof TOutput]: TOutput[K]
  }>
} & WorkflowDataProperties<{
  [K in keyof TOutput]: TOutput[K]
}>

export type WorkflowDataProperties<T = unknown> = {
  __type: Symbol
  __step__: string
  __value?: T | (() => T)
}

export type WorkflowData<T = unknown> = (T extends object
  ? {
      [Key in keyof T]: WorkflowData<T[Key]>
    }
  : WorkflowDataProperties<T>) &
  WorkflowDataProperties<T>

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

export interface StepExecutionContext {
  container: MedusaContainer
  metadata: TransactionPayload["metadata"]
  context: Context
}

export type WorkflowTransactionContext = StepExecutionContext &
  OriginalWorkflowTransactionContext & {
    invoke: { [key: string]: { output: any } }
  }
