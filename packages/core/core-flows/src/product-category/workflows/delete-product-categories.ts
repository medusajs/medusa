import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductCategoriesStep } from "../steps"

export const deleteProductCategoriesWorkflowId = "delete-product-categories"
export const deleteProductCategoriesWorkflow = createWorkflow(
  deleteProductCategoriesWorkflowId,
  (input: WorkflowData<string[]>) => {
    return deleteProductCategoriesStep(input)
  }
)
