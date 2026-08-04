import {
  createHook,
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deletePromotionsStep } from "../steps"

/**
 * The data to delete one or more promotions.
 */
export type DeletePromotionsWorkflowInput = { 
  /**
   * The IDs of the promotions to delete.
   */
  ids: string[]
}

export const deletePromotionsWorkflowId = "delete-promotions"
/**
 * This workflow deletes one or more promotions. It's used by the
 * [Delete Promotions Admin API Route](https://docs.medusajs.com/api/admin/promotions/delete-a-promotion).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * delete promotions within your custom flows.
 * 
 * @example
 * const { result } = await deletePromotionsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["promo_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more promotions.
 */
export const deletePromotionsWorkflow = createWorkflow(
  deletePromotionsWorkflowId,
  (input: WorkflowData<DeletePromotionsWorkflowInput>) => {
    const deletedPromotions = deletePromotionsStep(input.ids)
    const promotionsDeleted = createHook("promotionsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedPromotions, {
      hooks: [promotionsDeleted],
    })
  }
)
