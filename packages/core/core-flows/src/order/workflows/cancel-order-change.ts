import { CancelOrderChangeDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { cancelOrderChangeStep } from "../steps"

export const cancelOrderChangeWorkflowId = "cancel-order-change"
/**
 * This workflow cancels an order change.
 */
export const cancelOrderChangeWorkflow = createWorkflow(
  cancelOrderChangeWorkflowId,
  (input: WorkflowData<CancelOrderChangeDTO>): WorkflowData<void> => {
    cancelOrderChangeStep(input)
  }
)
