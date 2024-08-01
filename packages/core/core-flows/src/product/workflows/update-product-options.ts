import { ProductTypes } from "@medusajs/types"
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
  additional_data?: Record<string, unknown>
}

type WorkflowInput = UpdateProductOptionsStepInput

export const updateProductOptionsWorkflowId = "update-product-options"
export const updateProductOptionsWorkflow = createWorkflow(
  updateProductOptionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const updatedProductOptions = updateProductOptionsStep(input)
    const productOptionsUpdated = createHook("productOptionsUpdated", {
      selector: input.selector,
      update: input.update,
      additional_data: input.additional_data,
      product_options: updatedProductOptions,
    })

    return new WorkflowResponse(updatedProductOptions, {
      hooks: [productOptionsUpdated],
    })
  }
)
