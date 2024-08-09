import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteProductOptionsStep } from "../steps"

export type DeleteProductOptionsWorkflowInput = { ids: string[] }

export const deleteProductOptionsWorkflowId = "delete-product-options"
/**
 * This workflow deletes one or more product options.
 */
export const deleteProductOptionsWorkflow = createWorkflow(
  deleteProductOptionsWorkflowId,
  (input: WorkflowData<DeleteProductOptionsWorkflowInput>) => {
    const deletedProductOptions = deleteProductOptionsStep(input.ids)
    const productOptionsDeleted = createHook("productOptionsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProductOptions, {
      hooks: [productOptionsDeleted],
    })
  }
)
