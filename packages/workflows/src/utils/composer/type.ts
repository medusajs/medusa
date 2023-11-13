import { OrchestratorBuilder, WorkflowHandler } from "@medusajs/orchestration"

export type StepFunctionResult<T extends unknown | unknown[] = unknown> = (
  this: CreateWorkflowComposerContext
) => T extends [] ? [...StepReturn<T[number]>[]] : StepReturn

export type StepFunction<
  TInput extends unknown[] = unknown[],
  TResult extends unknown = unknown
> = {
  (...inputs: StepReturn<TInput[number]>[]): StepReturn<TResult>
} & StepReturn<TResult>

export type StepReturn<T = unknown> = T extends object
  ? {
      [Key in keyof T]: StepReturn<T[Key]>
    } & {
      __type: Symbol
      __step__: string
      __returnProperties: string
      value?: T
    }
  : {
      __type: Symbol
      __step__: string
      __returnProperties: string
      value?: T
    }

export type StepTransformer<T = unknown> = {
  __type: Symbol
  __result: T
}

export type StepBinderReturn = {
  __type: Symbol
  __step__: string
}

export type CreateWorkflowComposerContext = {
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  stepBinder: <TResult extends unknown = unknown>(
    fn: StepFunctionResult
  ) => StepReturn<TResult>
  parallelizeBinder: <TResult extends StepReturn[] = StepReturn[]>(
    fn: (this: CreateWorkflowComposerContext) => TResult
  ) => TResult
}
