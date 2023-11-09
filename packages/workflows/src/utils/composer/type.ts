import { OrchestratorBuilder, WorkflowHandler } from "@medusajs/orchestration"

export type StepFunction = Function & { __step__: string }

export type WorkflowContext = {
  workflowId: string
  flow: OrchestratorBuilder
  handlers: WorkflowHandler
  step: (
    fn: () => {
      __step__: string
    }
  ) => void
  parallelize: (
    fn: () => [
      {
        __step__: string
      }
    ]
  ) => void
}
