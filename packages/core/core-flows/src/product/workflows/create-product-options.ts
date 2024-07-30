import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductOptionsStep } from "../steps"

type WorkflowInput = { product_options: ProductTypes.CreateProductOptionDTO[] }

export const createProductOptionsWorkflowId = "create-product-options"
export const createProductOptionsWorkflow = createWorkflow(
  createProductOptionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<ProductTypes.ProductOptionDTO[]>> => {
    return new WorkflowResponse(createProductOptionsStep(input.product_options))
  }
)
