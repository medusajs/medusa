import { OrchestratorBuilder, WorkflowHandler } from "@medusajs/orchestration"

export type StepFunctionResult<T extends undefined | [] = undefined> = (
  this: CreateWorkflowComposerContext
) => T extends [] ? StepReturn[] : StepReturn

export type StepFunction = {
  (...inputs: StepInput[]): StepReturn
} & StepReturn

export type StepInput<T = unknown> = {
  __type: Symbol
  __step__?: string
  value?: T
}

export type StepReturn<T = unknown> = {
  __type: Symbol
  __step__: string
}

export type StepTransformer<T = unknown> = {
  __type: Symbol
  __result: T
}

export type CreateWorkflowComposerContext = {
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  stepBinder: (fn: StepFunctionResult) => StepReturn
  parallelizeBinder: (fn: StepFunctionResult<[]>) => StepReturn[]
}
