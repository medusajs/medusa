import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductOptionsStep } from "../steps"

type WorkflowInput = {
  product_options: ProductTypes.CreateProductOptionDTO[]
  additional_data?: Record<string, unknown>
}

export const createProductOptionsWorkflowId = "create-product-options"

export const createProductOptionsWorkflow = createWorkflow(
  createProductOptionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const productOptions = createProductOptionsStep(input.product_options)
    const productOptionsCreated = createHook("productOptionsCreated", {
      product_options: productOptions,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(productOptions, {
      hooks: [productOptionsCreated],
    })
  }
)
