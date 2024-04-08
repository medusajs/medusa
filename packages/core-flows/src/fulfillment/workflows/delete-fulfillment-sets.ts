import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteFulfillmentSetsStep } from "../steps"

export const deleteFulfillmentSetsWorkflowId =
  "delete-fulfillment-sets-workflow"
export const deleteFulfillmentSetsWorkflow = createWorkflow(
  deleteFulfillmentSetsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>) => {
    deleteFulfillmentSetsStep(input.ids)
  }
)
