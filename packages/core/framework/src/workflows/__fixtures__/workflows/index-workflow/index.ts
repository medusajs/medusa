import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"

export const indexWorkflowId = "index-workflow"

const step = createStep("index-step", () => {
  return {} as any
})

export const indexWorkflow = createWorkflow(indexWorkflowId, () => {
  step()
  return new WorkflowResponse(void 0)
})
