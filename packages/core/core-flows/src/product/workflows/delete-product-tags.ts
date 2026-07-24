import { ProductTagWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteProductTagsStep } from "../steps"

/**
 * The data to delete one or more product tags.
 */
export type DeleteProductTagsWorkflowInput = { 
  /**
   * The IDs of the tags to delete.
   */
  ids: string[]
}

export const deleteProductTagsWorkflowId = "delete-product-tags"
/**
 * This workflow deletes one or more product tags. It's used by the 
 * [Delete Product Tags Admin API Route](https://docs.medusajs.com/api/admin/product-tags/delete-a-product-tag).
 * 
 * This workflow has a hook that allows you to perform custom actions after the product tags are deleted. For example, 
 * you can delete custom records linked to the product tags.
 * 
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-tag deletion.
 * 
 * @example
 * const { result } = await deleteProductTagsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["ptag_123"],
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more product tags.
 * 
 * @property hooks.productTagsDeleted - This hook is executed after the tags are deleted. You can consume this hook to perform custom actions on the deleted tags.
 */
export const deleteProductTagsWorkflow = createWorkflow(
  deleteProductTagsWorkflowId,
  (input: WorkflowData<DeleteProductTagsWorkflowInput>) => {
    const deletedProductTags = deleteProductTagsStep(input.ids)
    const productTagsDeleted = createHook("productTagsDeleted", {
      ids: input.ids,
    })

    const tagIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductTagWorkflowEvents.DELETED,
      data: tagIdEvents,
    })

    return new WorkflowResponse(deletedProductTags, {
      hooks: [productTagsDeleted],
    })
  }
)
