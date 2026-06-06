import {
  OrderChangeActionDTO,
  UpdateOrderChangeActionDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { updateOrderChangeActionsStep } from "../steps"

export const updateOrderChangeActionsWorkflowId = "update-order-change-actions"
/**
 * This workflow updates one or more order change actions.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * updating order change actions.
 * 
 * @summary
 * 
 * Update one or more order change actions.
 */
export const updateOrderChangeActionsWorkflow = createWorkflow(
  updateOrderChangeActionsWorkflowId,
  (
    input: WorkflowData<UpdateOrderChangeActionDTO[]>
  ): WorkflowResponse<OrderChangeActionDTO[]> => {
    return new WorkflowResponse(updateOrderChangeActionsStep(input))
  }
)
