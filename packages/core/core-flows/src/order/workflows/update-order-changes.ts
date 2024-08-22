import { OrderChangeDTO, UpdateOrderChangeActionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
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
