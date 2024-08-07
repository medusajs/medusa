import { createHook, createWorkflow, WorkflowData, WorkflowResponse } from "@medusajs/workflows-sdk"
import { deleteCampaignsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCampaignsWorkflowId = "delete-campaigns"
export const deleteCampaignsWorkflow = createWorkflow(
  deleteCampaignsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const deletedCampaigns = deleteCampaignsStep(input.ids)
    const campaignsDeleted = createHook("campaignsDeleted", {
      ids: input.ids
    })

    return new WorkflowResponse(deletedCampaigns, {
      hooks: [campaignsDeleted]
    })
  }
)
