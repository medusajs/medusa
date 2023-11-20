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
        ...StepReturn<{
          [K in keyof Omit<
            TOutput[number],
            "compensateInput"
          >]: TOutput[number][K]
        }>[]
      ]
    : StepReturn<{ [K in keyof Omit<TOutput, "compensateInput">]: TOutput[K] }>

export type StepFunction<TInput extends object = object, TOutput = unknown> = {
  (input: { [K in keyof TInput]: StepReturn<TInput[K]> }): StepReturn<{
    [K in keyof Omit<TOutput, "compensateInput">]: TOutput[K]
  }>
} & StepReturnProperties<{
  [K in keyof Omit<TOutput, "compensateInput">]: TOutput[K]
}>

export type StepReturnProperties<T = unknown> = {
  __type: Symbol
  __step__: string
  __value?: T | (() => T)
}

export type StepReturn<T = unknown> = (T extends object
  ? {
      [Key in keyof T]: StepReturn<T[Key]>
    }
  : StepReturnProperties<T>) &
  StepReturnProperties<T>

export type CreateWorkflowComposerContext = {
  hooks_: string[]
  hooksCallback_: Record<string, Function[]>
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  stepBinder: <TOutput = unknown>(fn: StepFunctionResult) => StepReturn<TOutput>
  hookBinder: <TOutput = unknown>(
    name: string,
    fn: Function
  ) => StepReturn<TOutput>
  parallelizeBinder: <TOutput extends StepReturn[] = StepReturn[]>(
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
