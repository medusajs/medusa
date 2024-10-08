import { AdditionalData, UpdateCampaignDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateCampaignsStep } from "../steps"

export type UpdateCampaignsWorkflowInput = {
  campaignsData: UpdateCampaignDTO[]
} & AdditionalData

export const updateCampaignsWorkflowId = "update-campaigns"
/**
 * This workflow updates one or more campaigns.
 */
export const updateCampaignsWorkflow = createWorkflow(
  updateCampaignsWorkflowId,
  (input: WorkflowData<UpdateCampaignsWorkflowInput>) => {
    const updatedCampaigns = updateCampaignsStep(input.campaignsData)
    const campaignsUpdated = createHook("campaignsUpdated", {
      campaigns: updatedCampaigns,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedCampaigns, {
      hooks: [campaignsUpdated],
    })
  }
)
