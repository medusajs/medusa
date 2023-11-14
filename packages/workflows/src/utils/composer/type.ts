import { OrchestratorBuilder, WorkflowHandler } from "@medusajs/orchestration"

export type StepFunctionResult<TOutput extends unknown | unknown[] = unknown> =
  (
    this: CreateWorkflowComposerContext
  ) => TOutput extends [] ? [...StepReturn<TOutput[number]>[]] : StepReturn

export type StepFunction<
  TInput extends unknown[] = unknown[],
  TOutput = unknown
> = {
  (...inputs: StepReturn<TInput[number]>[]): StepReturn<TOutput>
} & StepReturn<TOutput>

export type StepReturnProperties<T = unknown> = {
  __type: Symbol
  __step__: string
  __value?: T
}

export type StepReturn<T = unknown> = T extends object
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
