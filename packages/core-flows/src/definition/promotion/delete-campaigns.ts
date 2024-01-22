import { createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCampaignsStep } from "../../handlers/promotion"

type WorkflowInput = { ids: string[] }
type WorkflowOutput = void

export const deleteCampaignsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>("delete-promotions", (input) => {
  return deleteCampaignsStep(input.ids)
})
