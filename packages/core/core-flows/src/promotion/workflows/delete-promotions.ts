import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { deletePromotionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deletePromotionsWorkflowId = "delete-promotions"
export const deletePromotionsWorkflow = createWorkflow(
  deletePromotionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deletePromotionsStep(input.ids)
  }
)
