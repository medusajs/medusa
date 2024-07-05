import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createProductOptionsStep } from "../steps"

type WorkflowInput = { product_options: ProductTypes.CreateProductOptionDTO[] }

export const createProductOptionsWorkflowId = "create-product-options"
export const createProductOptionsWorkflow = createWorkflow(
  createProductOptionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductOptionDTO[]> => {
    return createProductOptionsStep(input.product_options)
  }
)
