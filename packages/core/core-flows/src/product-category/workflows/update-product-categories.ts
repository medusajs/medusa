import { ProductCategoryWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductCategoriesStep } from "../steps"

export const updateProductCategoriesWorkflowId = "update-product-categories"
/**
 * This workflow updates product categories matching specified filters.
 */
export const updateProductCategoriesWorkflow = createWorkflow(
  updateProductCategoriesWorkflowId,
  (input: WorkflowData<ProductCategoryWorkflow.UpdateProductCategoriesWorkflowInput>) => {
    return new WorkflowResponse(updateProductCategoriesStep(input))
  }
)
