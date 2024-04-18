import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { cancelFulfillmentsStep } from "../steps"

export const cancelFulfillmentsWorkflowId = "cancel-fulfillments-workflow"
export const cancelFulfillmentsWorkflow = createWorkflow(
  cancelFulfillmentsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>) => {
    cancelFulfillmentsStep(input.ids)
  }
)
