import {
  CreateOrderReturnReasonDTO,
  OrderReturnReasonDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createReturnReasonsStep } from "../steps"

type WorkflowInput = { customersData: CreateOrderReturnReasonDTO[] }

export const createReturnReasonsWorkflowId = "create-return-reasons"
export const createReturnReasonsWorkflow = createWorkflow(
  createReturnReasonsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<OrderReturnReasonDTO[]> => {
    return createReturnReasonsStep(input.customersData)
  }
)
