import { ProductCategoryWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createProductCategoryStep } from "../steps"

type WorkflowInputData =
  ProductCategoryWorkflow.CreateProductCategoryWorkflowInput

export const createProductCategoryWorkflowId = "create-product-category"
export const createProductCategoryWorkflow = createWorkflow(
  createProductCategoryWorkflowId,
  (input: WorkflowData<WorkflowInputData>) => {
    const category = createProductCategoryStep(input)

    return category
  }
)
