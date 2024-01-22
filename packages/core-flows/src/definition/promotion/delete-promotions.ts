import { createWorkflow } from "@medusajs/workflows-sdk"
import { deletePromotionsStep } from "../../handlers/promotion"

type WorkflowInput = { ids: string[] }
type WorkflowOutput = void

export const deletePromotionsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>("delete-promotions", (input) => {
  return deletePromotionsStep(input.ids)
})
