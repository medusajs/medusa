import type { CancelOrderChangeDTO } from "@zjedene-medusa/framework/types"
import { WorkflowData, createWorkflow } from "@zjedene-medusa/framework/workflows-sdk"
import { cancelOrderChangeStep } from "../steps"

export const cancelOrderChangeWorkflowId = "cancel-order-change"
/**
 * This workflow cancels an order change.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * canceling an order change.
 *
 * @summary
 *
 * Cancel an order change.
 */
export const cancelOrderChangeWorkflow = createWorkflow(
  cancelOrderChangeWorkflowId,
  (input: WorkflowData<CancelOrderChangeDTO>): WorkflowData<void> => {
    cancelOrderChangeStep(input)
  }
)
