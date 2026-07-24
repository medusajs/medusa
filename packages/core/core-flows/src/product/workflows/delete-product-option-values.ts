import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteProductOptionValuesStep } from "../steps"

/**
 * The data to delete one or more product option values.
 */
export type DeleteProductOptionValuesWorkflowInput = {
  /**
   * The IDs of the product option values to delete.
   */
  ids: string[]
}

export const deleteProductOptionValuesWorkflowId =
  "delete-product-option-values"
/**
 * This workflow deletes one or more product option values. It's used by the
 * Delete Product Option Value Admin API Route.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to wrap custom logic around product-option-value deletion.
 *
 * @example
 * const { result } = await deleteProductOptionValuesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["optval_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more product option values.
 */
export const deleteProductOptionValuesWorkflow = createWorkflow(
  deleteProductOptionValuesWorkflowId,
  (input: WorkflowData<DeleteProductOptionValuesWorkflowInput>) => {
    const deletedProductOptionValues = deleteProductOptionValuesStep(input.ids)

    return new WorkflowResponse(deletedProductOptionValues)
  }
)
