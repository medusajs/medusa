import type {
  AdditionalData,
  UpdateCampaignDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateCampaignsStep } from "../steps"

/**
 * The data to update one or more campaigns, along with custom data that's passed to the workflow's hooks.
 */
export type UpdateCampaignsWorkflowInput = {
  /**
   * The campaigns to update.
   */
  campaignsData: UpdateCampaignDTO[]
} & AdditionalData

export const updateCampaignsWorkflowId = "update-campaigns"
/**
 * This workflow updates one or more campaigns. It's used by the [Update Campaign Admin API Route](https://docs.medusajs.com/api/admin/campaigns/update-a-campaign).
 *
 * This workflow has a hook that allows you to perform custom actions on the updated campaigns. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the campaigns.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around updating campaigns.
 *
 * @example
 * const { result } = await updateCampaignsWorkflow(container)
 * .run({
 *   input: {
 *     campaignsData: [
 *       {
 *         id: "camp_123",
 *         name: "Launch Promotions",
 *         ends_at: new Date("2026-01-01"),
 *       }
 *     ],
 *     additional_data: {
 *       target_audience: "new_customers"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more campaigns.
 *
 * @property hooks.campaignsUpdated - This hook is executed after the campaigns are updated. You can consume this hook to perform custom actions on the updated campaigns.
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
