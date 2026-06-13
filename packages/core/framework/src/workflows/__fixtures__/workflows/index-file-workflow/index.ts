import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"

export const indexFileWorkflowId = "index-file-workflow"

const step = createStep("index-file-step", () => {
  return {} as any
})

export const indexFileWorkflow = createWorkflow(indexFileWorkflowId, () => {
  step()
  return new WorkflowResponse(void 0)
})
