import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { cancelFulfillmentStep } from "../steps"

export const cancelFulfillmentWorkflowId = "cancel-fulfillment-workflow"
/**
 * This workflow cancels a fulfillment.
 */
export const cancelFulfillmentWorkflow = createWorkflow(
  cancelFulfillmentWorkflowId,
  (input: WorkflowData<{ id: string }>) => {
    cancelFulfillmentStep(input.id)
  }
)
