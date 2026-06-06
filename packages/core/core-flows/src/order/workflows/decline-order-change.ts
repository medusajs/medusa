import type { DeclineOrderChangeDTO } from "@zjedene-medusa/framework/types"
import { WorkflowData, createWorkflow } from "@zjedene-medusa/framework/workflows-sdk"
import { declineOrderChangeStep } from "../steps"

export const declineOrderChangeWorkflowId = "decline-order-change"
/**
 * This workflow declines an order change.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * declining an order change.
 *
 * @summary
 *
 * Decline an order change.
 */
export const declineOrderChangeWorkflow = createWorkflow(
  declineOrderChangeWorkflowId,
  (input: WorkflowData<DeclineOrderChangeDTO>): WorkflowData<void> => {
    declineOrderChangeStep(input)
  }
)
