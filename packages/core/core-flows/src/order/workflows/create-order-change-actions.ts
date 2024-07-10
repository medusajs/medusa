import {
  CreateOrderChangeActionDTO,
  OrderChangeActionDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createOrderChangeActionsStep } from "../steps"

export const createOrderChangeActionsWorkflowId = "create-order-change-actions"
export const createOrderChangeActionsWorkflow = createWorkflow(
  createOrderChangeActionsWorkflowId,
  (
    input: WorkflowData<CreateOrderChangeActionDTO[]>
  ): WorkflowData<OrderChangeActionDTO[]> => {
    return createOrderChangeActionsStep(input)
  }
)
