import { CampaignDTO, CreateCampaignDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createCampaignsStep } from "../steps"

type WorkflowInput = { campaignsData: CreateCampaignDTO[] }

export const createCampaignsWorkflowId = "create-campaigns"
export const createCampaignsWorkflow = createWorkflow(
  createCampaignsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<CampaignDTO[]> => {
    return new WorkflowResponse(createCampaignsStep(input.campaignsData))
  }
)
