import { DeclineOrderChangeDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { declineOrderChangeStep } from "../steps"

export const declineOrderChangeWorkflowId = "decline-order-change"
export const declineOrderChangeWorkflow = createWorkflow(
  declineOrderChangeWorkflowId,
  (input: WorkflowData<DeclineOrderChangeDTO>): WorkflowData<void> => {
    declineOrderChangeStep(input)
  }
)
