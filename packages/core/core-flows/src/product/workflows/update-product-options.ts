import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductOptionsStep } from "../steps"

type UpdateProductOptionsStepInput = {
  selector: ProductTypes.FilterableProductOptionProps
  update: ProductTypes.UpdateProductOptionDTO
} & AdditionalData

type WorkflowInput = UpdateProductOptionsStepInput

export const updateProductOptionsWorkflowId = "update-product-options"
export const updateProductOptionsWorkflow = createWorkflow(
  updateProductOptionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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
