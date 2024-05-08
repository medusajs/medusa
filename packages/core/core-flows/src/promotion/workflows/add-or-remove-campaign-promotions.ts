import { LinkWorkflowInput } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { addOrRemoveCampaignPromotionsStep } from "../steps"

export const addOrRemoveCampaignPromotionsWorkflowId =
  "add-or-remove-campaign-promotions"
export const addOrRemoveCampaignPromotionsWorkflow = createWorkflow(
  addOrRemoveCampaignPromotionsWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    addOrRemoveCampaignPromotionsStep(input)
  }
)
