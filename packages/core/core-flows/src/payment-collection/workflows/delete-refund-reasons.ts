import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteRefundReasonsStep } from "../steps"

export const deleteRefundReasonsWorkflowId = "delete-refund-reasons-workflow"
/**
 * This workflow deletes one or more refund reasons.
 */
export const deleteRefundReasonsWorkflow = createWorkflow(
  deleteRefundReasonsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowResponse<void> => {
    return new WorkflowResponse(deleteRefundReasonsStep(input.ids))
  }
)
