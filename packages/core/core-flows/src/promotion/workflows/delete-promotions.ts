import { createHook, createWorkflow, WorkflowData, WorkflowResponse } from "@medusajs/workflows-sdk"
import { deletePromotionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deletePromotionsWorkflowId = "delete-promotions"
export const deletePromotionsWorkflow = createWorkflow(
  deletePromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const deletedPromotions = deletePromotionsStep(input.ids)
    const promotionsDeleted = createHook("promotionsDeleted", {
      ids: input.ids
    })
    
    return new WorkflowResponse(deletedPromotions, {
      hooks: [promotionsDeleted]
    })
  }
)
