import type { LinkWorkflowInput } from "@medusajs/framework/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/framework/workflows-sdk"
import {
  addCampaignPromotionsStep,
  removeCampaignPromotionsStep,
} from "../steps"

/**
 * The data to manage the promotions of a campaign.
 *
 * @property id - The ID of the campaign to manage the promotions of.
 * @property add - The IDs of the promotions to add to the campaign.
 * @property remove - The IDs of the promotions to remove from the campaign.
 */
export type AddOrRemoveCampaignPromotionsWorkflowInput = LinkWorkflowInput

export const addOrRemoveCampaignPromotionsWorkflowId =
  "add-or-remove-campaign-promotions"
/**
 * This workflow manages the promotions of a campaign. It's used by the
 * [Manage Promotions Admin API Route](https://docs.medusajs.com/api/admin/campaigns/manage-promotions).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * manage the promotions of a campaign within your custom flows.
 *
 * @example
 * const { result } = await addOrRemoveCampaignPromotionsWorkflow(container)
 * .run({
 *   input: {
 *     id: "camp_123",
 *     add: ["promo_123"],
 *     remove: ["promo_321"]
 *   }
 * })
 *
 * @summary
 *
 * Manage the promotions of a campaign.
 */
export const addOrRemoveCampaignPromotionsWorkflow = createWorkflow(
  addOrRemoveCampaignPromotionsWorkflowId,
  (
    input: WorkflowData<AddOrRemoveCampaignPromotionsWorkflowInput>
  ): WorkflowData<void> => {
    parallelize(
      addCampaignPromotionsStep(input),
      removeCampaignPromotionsStep(input)
    )
  }
)
