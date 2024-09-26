import {
  createHook,
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deleteCampaignsStep } from "../steps"

export type DeleteCampaignsWorkflowInput = { ids: string[] }

export const deleteCampaignsWorkflowId = "delete-campaigns"
/**
 * This workflow deletes one or more campaigns.
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
