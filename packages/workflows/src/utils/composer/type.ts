import {
  OrchestratorBuilder,
  TransactionContext as OriginalWorkflowTransactionContext,
  TransactionPayload,
  WorkflowHandler,
} from "@medusajs/orchestration"
import { Context, MedusaContainer } from "@medusajs/types"

export type StepFunctionResult<TOutput extends unknown | unknown[] = unknown> =
  (
    this: CreateWorkflowComposerContext
  ) => TOutput extends [] ? [...StepReturn<TOutput[number]>[]] : StepReturn

export type StepFunction<
  TInput extends unknown[] = unknown[],
  TOutput = unknown
> = TInput extends [...infer Args, StepExecutionContext]
  ? {
      (...args: { [K in keyof Args]: StepReturn<Args[K]> }): StepReturn<TOutput>
    } & StepReturnProperties<TOutput>
  : {
      (
        ...args: { [K in keyof TInput]: StepReturn<TInput[K]> }
      ): StepReturn<TOutput>
    } & StepReturnProperties<TOutput>

export type StepReturnProperties<T = unknown> = {
  __type: Symbol
  __step__: string
  __value?: T
}

export type StepReturn<T = unknown> = T extends {
  compensateInput: infer CompensateInput
}
  ? StepReturn<Omit<T, "compensateInput">>
  : T extends object
  ? {
      [Key in keyof T]: StepReturn<T[Key]>
    } & StepReturnProperties<T>
  : StepReturnProperties<T>

export type CreateWorkflowComposerContext = {
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  stepBinder: <TOutput = unknown>(fn: StepFunctionResult) => StepReturn<TOutput>
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
