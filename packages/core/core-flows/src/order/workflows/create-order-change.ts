import { CreateOrderChangeDTO, OrderChangeDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createOrderChangeStep } from "../steps"

export const createOrderChangeWorkflowId = "create-order-change"
export const createOrderChangeWorkflow = createWorkflow(
  createOrderChangeWorkflowId,
  (input: WorkflowData<CreateOrderChangeDTO>): WorkflowData<OrderChangeDTO> => {
    return createOrderChangeStep(input)
  }
)
