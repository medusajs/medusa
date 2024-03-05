import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductsWorkflowId = "delete-products"
export const deleteProductsWorkflow = createWorkflow(
  deleteProductsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteProductsStep(input.ids)
  }
)
