import { LinkWorkflowInput } from "@medusajs/framework/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/framework/workflows-sdk"
import {
  addCampaignPromotionsStep,
  removeCampaignPromotionsStep,
} from "../steps"

export const addOrRemoveCampaignPromotionsWorkflowId =
  "add-or-remove-campaign-promotions"
/**
 * This workflow adds or removes promotions from campaigns.
 */
export const addOrRemoveCampaignPromotionsWorkflow = createWorkflow(
  addOrRemoveCampaignPromotionsWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    parallelize(
      addCampaignPromotionsStep(input),
      removeCampaignPromotionsStep(input)
    )
  }
)
