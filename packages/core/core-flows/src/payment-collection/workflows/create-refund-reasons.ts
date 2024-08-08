import { CreateRefundReasonDTO, RefundReasonDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createRefundReasonStep } from "../steps/create-refund-reasons"

export const createRefundReasonsWorkflowId = "create-refund-reasons-workflow"
export const createRefundReasonsWorkflow = createWorkflow(
  createRefundReasonsWorkflowId,
  (
    input: WorkflowData<{ data: CreateRefundReasonDTO[] }>
  ): WorkflowResponse<RefundReasonDTO[]> => {
    return new WorkflowResponse(createRefundReasonStep(input.data))
  }
)
