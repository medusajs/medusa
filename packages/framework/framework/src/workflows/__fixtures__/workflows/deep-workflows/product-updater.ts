import { createStep, createWorkflow } from "@medusajs/workflows-sdk"

export const productWorkflowId = "product-notifier-workflow"

const step = createStep("product-step", () => {
  return {} as any
})

export const productUpdatedWorkflow = createWorkflow(productWorkflowId, () => {
  return step()
})
