import { AdditionalData, ProductTypes } from "@medusajs/types"
import { ProductTypeWorkflowEvents } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { updateProductTypesStep } from "../steps"

type UpdateProductTypesWorkflowInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
} & AdditionalData

export const updateProductTypesWorkflowId = "update-product-types"
/**
 * This workflow updates product types matching the specified filters.
 */
export const updateProductTypesWorkflow = createWorkflow(
  updateProductTypesWorkflowId,
  (input: WorkflowData<UpdateProductTypesWorkflowInput>) => {
    const updatedProductTypes = updateProductTypesStep(input)
    const productTypesUpdated = createHook("productTypesUpdated", {
      product_types: updatedProductTypes,
      additional_data: input.additional_data,
    })

    const typeIdEvents = transform(
      { updatedProductTypes },
      ({ updatedProductTypes }) => {
        const arr = Array.isArray(updatedProductTypes)
          ? updatedProductTypes
          : [updatedProductTypes]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductTypeWorkflowEvents.UPDATED,
      data: typeIdEvents,
    })

    return new WorkflowResponse(updatedProductTypes, {
      hooks: [productTypesUpdated],
    })
  }
)
