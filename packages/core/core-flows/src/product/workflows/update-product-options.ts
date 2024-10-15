import { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductOptionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
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

    const optionIdEvents = transform(
      { updatedProductOptions },
      ({ updatedProductOptions }) => {
        const arr = Array.isArray(updatedProductOptions)
          ? updatedProductOptions
          : [updatedProductOptions]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductOptionWorkflowEvents.UPDATED,
      data: optionIdEvents,
    })

    return new WorkflowResponse(updatedProductOptions, {
      hooks: [productOptionsUpdated],
    })
  }
)
