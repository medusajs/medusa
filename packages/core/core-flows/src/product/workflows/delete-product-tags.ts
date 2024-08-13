import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteProductTagsStep } from "../steps"

export type DeleteProductTagsWorkflowInput = { ids: string[] }

export const deleteProductTagsWorkflowId = "delete-product-tags"
/**
 * This workflow deletes one or more product tags.
 */
export const deleteProductTagsWorkflow = createWorkflow(
  deleteProductTagsWorkflowId,
  (input: WorkflowData<DeleteProductTagsWorkflowInput>) => {
    const deletedProductTags = deleteProductTagsStep(input.ids)
    const productTagsDeleted = createHook("productTagsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProductTags, {
      hooks: [productTagsDeleted],
    })
  }
)
