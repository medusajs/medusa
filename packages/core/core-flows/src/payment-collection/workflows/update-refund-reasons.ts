import { RefundReasonDTO, UpdateRefundReasonDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateRefundReasonsStep } from "../steps"

export const updateRefundReasonsWorkflowId = "update-refund-reasons"
export const updateRefundReasonsWorkflow = createWorkflow(
  updateRefundReasonsWorkflowId,
  (
    input: WorkflowData<UpdateRefundReasonDTO[]>
  ): WorkflowResponse<RefundReasonDTO[]> => {
    return new WorkflowResponse(updateRefundReasonsStep(input))
  }
)
