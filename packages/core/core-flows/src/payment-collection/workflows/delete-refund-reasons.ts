import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteRefundReasonsStep } from "../steps"

export const deleteRefundReasonsWorkflowId = "delete-refund-reasons-workflow"
export const deleteRefundReasonsWorkflow = createWorkflow(
  deleteRefundReasonsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<void> => {
    return deleteRefundReasonsStep(input.ids)
  }
)
