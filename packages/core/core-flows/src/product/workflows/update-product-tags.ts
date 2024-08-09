import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductTagsStep } from "../steps"

export type UpdateProductTagsWorkflowInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
} & AdditionalData

export const updateProductTagsWorkflowId = "update-product-tags"
/**
 * This workflow updates product tags matching the specified filters.
 */
export const updateProductTagsWorkflow = createWorkflow(
  updateProductTagsWorkflowId,
  (input: WorkflowData<UpdateProductTagsWorkflowInput>) => {
    const updatedProductTags = updateProductTagsStep(input)
    const productTagsUpdated = createHook("productTagsUpdated", {
      product_tags: updatedProductTags,
      additional_data: input.additional_data,
    })
    return new WorkflowResponse(updatedProductTags, {
      hooks: [productTagsUpdated],
    })
  }
)
