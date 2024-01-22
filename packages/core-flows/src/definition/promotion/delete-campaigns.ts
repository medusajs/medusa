import { createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCampaignsStep } from "../../handlers/promotion"

type WorkflowInput = { ids: string[] }
type WorkflowOutput = void

export const deleteCampaignsWorkflowId = "delete-campaigns"
export const deleteCampaignsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>(deleteCampaignsWorkflowId, (input) => {
  return deleteCampaignsStep(input.ids)
})
