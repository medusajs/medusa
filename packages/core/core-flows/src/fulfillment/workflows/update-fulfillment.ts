import { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateFulfillmentStep } from "../steps"

export const updateFulfillmentWorkflowId = "update-fulfillment-workflow"
/**
 * This workflow updates a fulfillment.
 */
export const updateFulfillmentWorkflow = createWorkflow(
  updateFulfillmentWorkflowId,
  (input: WorkflowData<FulfillmentWorkflow.UpdateFulfillmentWorkflowInput>) => {
    return new WorkflowResponse(updateFulfillmentStep(input))
  }
)
