import { ProductCategoryWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductCategoriesStep } from "../steps"

export const createProductCategoriesWorkflowId = "create-product-categories"
/**
 * This workflow creates one or more product categories.
 */
export const createProductCategoriesWorkflow = createWorkflow(
  createProductCategoriesWorkflowId,
  (input: WorkflowData<ProductCategoryWorkflow.CreateProductCategoriesWorkflowInput>) => {
    return new WorkflowResponse(createProductCategoriesStep(input))
  }
)
