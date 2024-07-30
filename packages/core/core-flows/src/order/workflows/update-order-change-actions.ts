import {
  OrderChangeActionDTO,
  UpdateOrderChangeActionDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateOrderChangeActionsStep } from "../steps"

export const updateOrderChangeActionsWorkflowId = "update-order-change-actions"
export const updateOrderChangeActionsWorkflow = createWorkflow(
  updateOrderChangeActionsWorkflowId,
  (
    input: WorkflowData<UpdateOrderChangeActionDTO[]>
  ): WorkflowResponse<WorkflowData<OrderChangeActionDTO[]>> => {
    return new WorkflowResponse(updateOrderChangeActionsStep(input))
  }
)
