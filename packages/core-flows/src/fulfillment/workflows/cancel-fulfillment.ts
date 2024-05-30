import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { cancelFulfillmentStep } from "../steps"

export const cancelFulfillmentWorkflowId = "cancel-fulfillment-workflow"
export const cancelFulfillmentWorkflow = createWorkflow(
  cancelFulfillmentWorkflowId,
  (input: WorkflowData<{ id: string }>) => {
    cancelFulfillmentStep(input.id)
  }
)
