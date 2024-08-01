import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductTypesStep } from "../steps"

type UpdateProductTypesStepInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
  additional_data?: Record<string, unknown>
}

type WorkflowInput = UpdateProductTypesStepInput

export const updateProductTypesWorkflowId = "update-product-types"
export const updateProductTypesWorkflow = createWorkflow(
  updateProductTypesWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const updatedProductTypes = updateProductTypesStep(input)
    const productTypesUpdated = createHook("productTypesUpdated", {
      selector: input.selector,
      update: input.update,
      additional_data: input.additional_data,
      product_types: updatedProductTypes,
    })

    return new WorkflowResponse(updatedProductTypes, {
      hooks: [productTypesUpdated],
    })
  }
)
