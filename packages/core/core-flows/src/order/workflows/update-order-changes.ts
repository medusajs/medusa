import {
  OrderChangeDTO,
  UpdateOrderChangeActionDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateOrderChangesStep } from "../steps"

export const updateOrderChangesWorkflowId = "update-order-change"
/**
 * This workflow updates one or more order changes.
 */
export const updateOrderChangesWorkflow = createWorkflow(
  updateOrderChangesWorkflowId,
  (
    input: WorkflowData<UpdateOrderChangeActionDTO[]>
  ): WorkflowResponse<OrderChangeDTO[]> => {
    return new WorkflowResponse(updateOrderChangesStep(input))
  }
)
