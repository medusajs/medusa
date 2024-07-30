import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductTagsStep } from "../steps"

type WorkflowInput = { product_tags: ProductTypes.CreateProductTagDTO[] }

export const createProductTagsWorkflowId = "create-product-tags"
export const createProductTagsWorkflow = createWorkflow(
  createProductTagsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<ProductTypes.ProductTagDTO[]>> => {
    return new WorkflowResponse(createProductTagsStep(input.product_tags))
  }
)
