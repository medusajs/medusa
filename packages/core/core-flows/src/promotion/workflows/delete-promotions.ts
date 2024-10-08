import {
  createHook,
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deletePromotionsStep } from "../steps"

export type DeletePromotionsWorkflowInput = { ids: string[] }

export const deletePromotionsWorkflowId = "delete-promotions"
/**
 * This workflow deletes one or more promotions.
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
