import { createWorkflow } from "@medusajs/workflows-sdk"
import { deletePromotionsStep } from "../../handlers/promotion"

type WorkflowInput = { ids: string[] }
type WorkflowOutput = void

export const deletePromotionsWorkflowId = "delete-promotions"
export const deletePromotionsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>(deletePromotionsWorkflowId, (input) => {
  return deletePromotionsStep(input.ids)
})
