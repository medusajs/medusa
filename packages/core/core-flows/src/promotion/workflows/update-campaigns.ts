import { AdditionalData, UpdateCampaignDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCampaignsStep } from "../steps"

type WorkflowInput = { campaignsData: UpdateCampaignDTO[] } & AdditionalData

export const updateCampaignsWorkflowId = "update-campaigns"
export const updateCampaignsWorkflow = createWorkflow(
  updateCampaignsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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
