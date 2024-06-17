import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { deleteCampaignsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCampaignsWorkflowId = "delete-campaigns"
export const deleteCampaignsWorkflow = createWorkflow(
  deleteCampaignsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCampaignsStep(input.ids)
  }
)
