import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductTagsStep } from "../steps"

type UpdateProductTagsStepInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
  additional_data?: Record<string, unknown>
}

type WorkflowInput = UpdateProductTagsStepInput

export const updateProductTagsWorkflowId = "update-product-tags"
export const updateProductTagsWorkflow = createWorkflow(
  updateProductTagsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const updatedProductTags = updateProductTagsStep(input)
    const productTagsUpdated = createHook("productTagsUpdated", {
      selector: input.selector,
      update: input.update,
      additional_data: input.additional_data,
      product_tags: updatedProductTags,
    })
    return new WorkflowResponse(updatedProductTags, {
      hooks: [productTagsUpdated],
    })
  }
)
