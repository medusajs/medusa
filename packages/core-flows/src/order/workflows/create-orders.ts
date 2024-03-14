import { CreateOrderDTO, OrderDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createOrdersStep } from "../steps"

type WorkflowInput = { orders: CreateOrderDTO[] }

export const createOrdersWorkflowId = "create-orders"
export const createOrdersWorkflow = createWorkflow(
  createOrdersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<OrderDTO[]> => {
    return createOrdersStep(input)
  }
)
