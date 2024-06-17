import { CampaignDTO, UpdateCampaignDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateCampaignsStep } from "../steps"

type WorkflowInput = { campaignsData: UpdateCampaignDTO[] }

export const updateCampaignsWorkflowId = "update-campaigns"
export const updateCampaignsWorkflow = createWorkflow(
  updateCampaignsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CampaignDTO[]> => {
    return updateCampaignsStep(input.campaignsData)
  }
)
