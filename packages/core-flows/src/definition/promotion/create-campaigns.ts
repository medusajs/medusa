import { CampaignDTO, CreateCampaignDTO } from "@medusajs/types"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { createCampaignsStep } from "../../handlers/promotion"

type WorkflowInput = { campaignsData: CreateCampaignDTO[] }
type WorkflowOutput = CampaignDTO[]

export const createCampaignsWorkflowId = "create-campaigns"
export const createCampaignsWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>(createCampaignsWorkflowId, (input) => {
  return createCampaignsStep(input.campaignsData)
})
