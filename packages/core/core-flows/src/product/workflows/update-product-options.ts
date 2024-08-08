import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductOptionsStep } from "../steps"

export type UpdateProductOptionsWorkflowInput = {
  selector: ProductTypes.FilterableProductOptionProps
  update: ProductTypes.UpdateProductOptionDTO
} & AdditionalData

export const updateProductOptionsWorkflowId = "update-product-options"
/**
 * This workflow updates product options matching the specified filters.
 */
export const updateProductOptionsWorkflow = createWorkflow(
  updateProductOptionsWorkflowId,
  (input: WorkflowData<UpdateProductOptionsWorkflowInput>) => {
    const updatedProductOptions = updateProductOptionsStep(input)
    const productOptionsUpdated = createHook("productOptionsUpdated", {
      product_options: updatedProductOptions,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedProductOptions, {
      hooks: [productOptionsUpdated],
    })
  }
)
