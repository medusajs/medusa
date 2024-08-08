import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteProductCategoriesStep } from "../steps"

export const deleteProductCategoriesWorkflowId = "delete-product-categories"
/**
 * This workflow deletes one or more product categories.
 */
export const deleteProductCategoriesWorkflow = createWorkflow(
  deleteProductCategoriesWorkflowId,
  (input: WorkflowData<string[]>) => {
    return deleteProductCategoriesStep(input)
  }
)
