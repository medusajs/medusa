import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductCategoryStep } from "../steps"

export const deleteProductCategoryWorkflowId = "delete-product-category"
export const deleteProductCategoryWorkflow = createWorkflow(
  deleteProductCategoryWorkflowId,
  (input: WorkflowData<string>) => {
    return deleteProductCategoryStep(input)
  }
)
