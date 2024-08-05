import { AdditionalData, CreateCampaignDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createCampaignsStep } from "../steps"

type WorkflowInput = { campaignsData: CreateCampaignDTO[] } & AdditionalData

export const createCampaignsWorkflowId = "create-campaigns"
export const createCampaignsWorkflow = createWorkflow(
  createCampaignsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const createdCampaigns = createCampaignsStep(input.campaignsData)
    const campaignsCreated = createHook("campaignsCreated", {
      campaigns: createdCampaigns,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(createdCampaigns, {
      hooks: [campaignsCreated],
    })
  }
)
