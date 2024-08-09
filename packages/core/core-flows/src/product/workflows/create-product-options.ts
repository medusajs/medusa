import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductOptionsStep } from "../steps"

export type CreateProductOptionsWorkflowInput = {
  product_options: ProductTypes.CreateProductOptionDTO[]
} & AdditionalData

export const createProductOptionsWorkflowId = "create-product-options"
/**
 * This workflow creates one or more product options.
 */
export const createProductOptionsWorkflow = createWorkflow(
  createProductOptionsWorkflowId,
  (input: WorkflowData<CreateProductOptionsWorkflowInput>) => {
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
