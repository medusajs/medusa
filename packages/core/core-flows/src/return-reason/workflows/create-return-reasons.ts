import {
  CreateOrderReturnReasonDTO,
  OrderReturnReasonDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createReturnReasonsStep } from "../steps"

export type CreateReturnReasonsWorkflowInput = { data: CreateOrderReturnReasonDTO[] }

export const createReturnReasonsWorkflowId = "create-return-reasons"
/**
 * This workflow creates one or more return reasons.
 */
export const createReturnReasonsWorkflow = createWorkflow(
  createReturnReasonsWorkflowId,
  (
    input: WorkflowData<CreateReturnReasonsWorkflowInput>
  ): WorkflowResponse<OrderReturnReasonDTO[]> => {
    return new WorkflowResponse(createReturnReasonsStep(input.data))
  }
)
