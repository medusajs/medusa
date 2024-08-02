import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductTagsStep } from "../steps"

type WorkflowInput = {
  product_tags: ProductTypes.CreateProductTagDTO[]
  additional_data?: Record<string, unknown>
}

export const createProductTagsWorkflowId = "create-product-tags"

export const createProductTagsWorkflow = createWorkflow(
  createProductTagsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const productTags = createProductTagsStep(input.product_tags)
    const productTagsCreated = createHook("productTagsCreated", {
      product_tags: productTags,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(productTags, {
      hooks: [productTagsCreated],
    })
  }
)
