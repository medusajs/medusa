import {
  createHook,
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deleteCampaignsStep } from "../steps"

/**
 * The data to delete one or more campaigns.
 */
export type DeleteCampaignsWorkflowInput = { 
  /**
   * The IDs of the campaigns to delete.
   */
  ids: string[]
}

export const deleteCampaignsWorkflowId = "delete-campaigns"
/**
 * This workflow deletes one or more campaigns. It's used by the
 * [Delete Campaign Admin API Route](https://docs.medusajs.com/api/admin/campaigns/delete-a-campaign).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * delete campaigns within your custom flows.
 * 
 * @example
 * const { result } = await deleteCampaignsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["camp_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more campaigns.
 */
export const deleteCampaignsWorkflow = createWorkflow(
  deleteCampaignsWorkflowId,
  (input: WorkflowData<DeleteCampaignsWorkflowInput>) => {
    const deletedCampaigns = deleteCampaignsStep(input.ids)
    const campaignsDeleted = createHook("campaignsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedCampaigns, {
      hooks: [campaignsDeleted],
    })
  }
)
