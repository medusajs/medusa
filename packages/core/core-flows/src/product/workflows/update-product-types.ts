import { AdditionalData, ProductTypes } from "@medusajs/types"
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
} & AdditionalData

type WorkflowInput = UpdateProductTypesStepInput

export const updateProductTypesWorkflowId = "update-product-types"
export const updateProductTypesWorkflow = createWorkflow(
  updateProductTypesWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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
