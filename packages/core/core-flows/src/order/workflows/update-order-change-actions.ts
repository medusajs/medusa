import {
  OrderChangeActionDTO,
  UpdateOrderChangeActionDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateOrderChangeActionsStep } from "../steps"

export const updateOrderChangeActionsWorkflowId = "update-order-change-actions"
export const updateOrderChangeActionsWorkflow = createWorkflow(
  updateOrderChangeActionsWorkflowId,
  (
    input: WorkflowData<UpdateOrderChangeActionDTO[]>
  ): WorkflowData<OrderChangeActionDTO[]> => {
    return updateOrderChangeActionsStep(input)
  }
)
