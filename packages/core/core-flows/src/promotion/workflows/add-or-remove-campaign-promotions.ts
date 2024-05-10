import { LinkWorkflowInput } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import {
  addCampaignPromotionsStep,
  removeCampaignPromotionsStep,
} from "../steps"

export const addOrRemoveCampaignPromotionsWorkflowId =
  "add-or-remove-campaign-promotions"
export const addOrRemoveCampaignPromotionsWorkflow = createWorkflow(
  addOrRemoveCampaignPromotionsWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    addCampaignPromotionsStep(input)
    removeCampaignPromotionsStep(input)
  }
)
