import {
  CreateRefundReasonDTO,
  RefundReasonDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createRefundReasonStep } from "../steps/create-refund-reasons"

export const createRefundReasonsWorkflowId = "create-refund-reasons-workflow"
/**
 * This workflow creates one or more refund reasons.
 */
export const createRefundReasonsWorkflow = createWorkflow(
  createRefundReasonsWorkflowId,
  (
    input: WorkflowData<{ data: CreateRefundReasonDTO[] }>
  ): WorkflowResponse<RefundReasonDTO[]> => {
    return new WorkflowResponse(createRefundReasonStep(input.data))
  }
)
