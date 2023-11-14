import {
  OrchestratorBuilder,
  TransactionContext as OriginalWorkflowTransactionContext,
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
> = {
  (...inputs: StepReturn<TInput[number]>[]): StepReturn<TOutput>
} & StepReturnProperties

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

// TODO: Create a type for the context in the orchestration package
// TODO: The below is a subset of the original transaction context

export interface StepExecutionContext {
  container: MedusaContainer
  metadata: any
  context: Context
}

export type WorkflowTransactionContext = StepExecutionContext &
  OriginalWorkflowTransactionContext & {
    invoke: { [key: string]: { output: any } }
  }
