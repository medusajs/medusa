import type { ProductTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateProductOptionValuesStep } from "../steps"

/**
 * The data to update a product option value.
 */
export type UpdateProductOptionValuesWorkflowInput = {
  /**
   * The ID of the product option value to update.
   */
  id: string
  /**
   * The data to update in the product option value.
   */
  update: ProductTypes.UpdateProductOptionValueDTO
}

export const updateProductOptionValuesWorkflowId =
  "update-product-option-values"
/**
 * This workflow updates a product option value. It's used by the
 * Update Product Option Value Admin API Route.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to wrap custom logic around product-option-value update.
 *
 * @example
 * const { result } = await updateProductOptionValuesWorkflow(container)
 * .run({
 *   input: {
 *     id: "optval_123",
 *     update: {
 *       metadata: { is_default: true }
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update a product option value.
 */
export const updateProductOptionValuesWorkflow = createWorkflow(
  updateProductOptionValuesWorkflowId,
  (input: WorkflowData<UpdateProductOptionValuesWorkflowInput>) => {
    const updatedProductOptionValue = updateProductOptionValuesStep(input)

    return new WorkflowResponse(updatedProductOptionValue)
  }
)
