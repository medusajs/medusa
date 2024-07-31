import { ProductCategoryWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductCategoriesStep } from "../steps"

type WorkflowInputData =
  ProductCategoryWorkflow.UpdateProductCategoriesWorkflowInput

export const updateProductCategoriesWorkflowId = "update-product-categories"
export const updateProductCategoriesWorkflow = createWorkflow(
  updateProductCategoriesWorkflowId,
  (input: WorkflowData<WorkflowInputData>) => {
    return new WorkflowResponse(updateProductCategoriesStep(input))
  }
)
