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

type WorkflowInput = { data: CreateOrderReturnReasonDTO[] }

export const createReturnReasonsWorkflowId = "create-return-reasons"
export const createReturnReasonsWorkflow = createWorkflow(
  createReturnReasonsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<OrderReturnReasonDTO[]> => {
    return new WorkflowResponse(createReturnReasonsStep(input.data))
  }
)
