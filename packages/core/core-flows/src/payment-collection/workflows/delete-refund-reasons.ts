import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteRefundReasonsStep } from "../steps"

export const deleteRefundReasonsWorkflowId = "delete-refund-reasons-workflow"
export const deleteRefundReasonsWorkflow = createWorkflow(
  deleteRefundReasonsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowResponse<void> => {
    return new WorkflowResponse(deleteRefundReasonsStep(input.ids))
  }
)
