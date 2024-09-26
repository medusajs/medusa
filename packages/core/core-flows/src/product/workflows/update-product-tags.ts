import { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductTagWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
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

    const tagIdEvents = transform(
      { updatedProductTags },
      ({ updatedProductTags }) => {
        const arr = Array.isArray(updatedProductTags)
          ? updatedProductTags
          : [updatedProductTags]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductTagWorkflowEvents.UPDATED,
      data: tagIdEvents,
    })

    return new WorkflowResponse(updatedProductTags, {
      hooks: [productTagsUpdated],
    })
  }
)
