import { AdditionalData, CreateCampaignDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createCampaignsStep } from "../steps"

export type CreateCampaignsWorkflowInput = {
  campaignsData: CreateCampaignDTO[]
} & AdditionalData

export const createCampaignsWorkflowId = "create-campaigns"
/**
 * This workflow creates one or more campaigns.
 */
export const createCampaignsWorkflow = createWorkflow(
  createCampaignsWorkflowId,
  (input: WorkflowData<CreateCampaignsWorkflowInput>) => {
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
