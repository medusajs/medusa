import { CreateOrderChangeDTO, OrderChangeDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createOrderChangeStep } from "../steps"

export const createOrderChangeWorkflowId = "create-order-change"
/**
 * This workflow creates an order change.
 */
export const createOrderChangeWorkflow = createWorkflow(
  createOrderChangeWorkflowId,
  (
    input: WorkflowData<CreateOrderChangeDTO>
  ): WorkflowResponse<OrderChangeDTO> => {
    return new WorkflowResponse(createOrderChangeStep(input))
  }
)
