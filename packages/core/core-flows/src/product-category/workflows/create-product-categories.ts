import { ProductCategoryWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createProductCategoriesStep } from "../steps"

type WorkflowInputData =
  ProductCategoryWorkflow.CreateProductCategoriesWorkflowInput

export const createProductCategoriesWorkflowId = "create-product-categories"
export const createProductCategoriesWorkflow = createWorkflow(
  createProductCategoriesWorkflowId,
  (input: WorkflowData<WorkflowInputData>) => {
    return createProductCategoriesStep(input)
  }
)
