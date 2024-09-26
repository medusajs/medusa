import { FulfillmentDTO, FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createReturnFulfillmentStep } from "../steps"

export const createReturnFulfillmentWorkflowId =
  "create-return-fulfillment-workflow"
/**
 * This workflow creates a fulfillment for a return.
 */
export const createReturnFulfillmentWorkflow = createWorkflow(
  createReturnFulfillmentWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateFulfillmentWorkflowInput>
  ): WorkflowResponse<FulfillmentDTO> => {
    return new WorkflowResponse(createReturnFulfillmentStep(input))
  }
)
