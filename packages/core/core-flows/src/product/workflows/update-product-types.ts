import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
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

    return new WorkflowResponse(updatedProductTypes, {
      hooks: [productTypesUpdated],
    })
  }
)
