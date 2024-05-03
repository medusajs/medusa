import { FulfillmentWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateFulfillmentStep } from "../steps"

export const updateFulfillmentWorkflowId = "update-fulfillment-workflow"
export const updateFulfillmentWorkflow = createWorkflow(
  updateFulfillmentWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.UpdateFulfillmentWorkflowInput>
  ): WorkflowData<void> => {
    updateFulfillmentStep(input)
  }
)
