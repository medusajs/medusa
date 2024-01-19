import { CampaignDTO, UpdateCampaignDTO } from "@medusajs/types"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { updateCampaignsStep } from "../../handlers/promotion"

type WorkflowInput = { campaignsData: UpdateCampaignDTO[] }
type WorkflowOutput = CampaignDTO[]

export const updateCampaignsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>("update-campaigns", (input) => {
  return updateCampaignsStep(input.campaignsData)
})
