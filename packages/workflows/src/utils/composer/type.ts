import { OrchestratorBuilder, WorkflowHandler } from "@medusajs/orchestration"

export type StepFunction = Function & { __type: Symbol; __step__: string }

export type StepInput<T = unknown> = {
  __type: Symbol
  __step__?: string
  value?: T
}

export type StepReturn<T = unknown> = {
  __type: Symbol
  __step__: string
}

export type CreateWorkflowComposerContext = {
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  stepBinder: (
    fn: (this: CreateWorkflowComposerContext) => {
      __type: Symbol
      __step__: string
    }
  ) => void
  parallelizeBinder: (
    fn: (this: CreateWorkflowComposerContext) => {
      __type: Symbol
      __step__: string
    }[]
  ) => void
}
