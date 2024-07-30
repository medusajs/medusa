import { CampaignDTO, UpdateCampaignDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCampaignsStep } from "../steps"

type WorkflowInput = { campaignsData: UpdateCampaignDTO[] }

export const updateCampaignsWorkflowId = "update-campaigns"
export const updateCampaignsWorkflow = createWorkflow(
  updateCampaignsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<CampaignDTO[]>> => {
    return new WorkflowResponse(updateCampaignsStep(input.campaignsData))
  }
)
