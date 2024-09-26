import {
  RefundReasonDTO,
  UpdateRefundReasonDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateRefundReasonsStep } from "../steps"

export const updateRefundReasonsWorkflowId = "update-refund-reasons"
/**
 * This workflow updates one or more refund reasons.
 */
export const updateRefundReasonsWorkflow = createWorkflow(
  updateRefundReasonsWorkflowId,
  (
    input: WorkflowData<UpdateRefundReasonDTO[]>
  ): WorkflowResponse<RefundReasonDTO[]> => {
    return new WorkflowResponse(updateRefundReasonsStep(input))
  }
)
