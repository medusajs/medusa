import { CreateOrderChangeDTO, OrderChangeDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createOrderChangeStep } from "../steps"

export const createOrderChangeWorkflowId = "create-order-change"
export const createOrderChangeWorkflow = createWorkflow(
  createOrderChangeWorkflowId,
  (
    input: WorkflowData<CreateOrderChangeDTO>
  ): WorkflowResponse<OrderChangeDTO> => {
    return new WorkflowResponse(createOrderChangeStep(input))
  }
)
