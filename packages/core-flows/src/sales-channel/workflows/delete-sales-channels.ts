import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteSalesChannelsStep } from "../steps/delete-sales-channels"

type WorkflowInput = { ids: string[] }

export const deleteSalesChannelsWorkflowId = "delete-sales-channels"
export const deleteSalesChannelsWorkflow = createWorkflow(
  deleteSalesChannelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteSalesChannelsStep(input.ids)
  }
)
