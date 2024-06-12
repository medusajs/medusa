import { ProductCategoryWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateProductCategoryStep } from "../steps"

type WorkflowInputData =
  ProductCategoryWorkflow.UpdateProductCategoryWorkflowInput

export const updateProductCategoryWorkflowId = "update-product-category"
export const updateProductCategoryWorkflow = createWorkflow(
  updateProductCategoryWorkflowId,
  (input: WorkflowData<WorkflowInputData>) => {
    const category = updateProductCategoryStep(input)

    return category
  }
)
