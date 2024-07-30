import { FulfillmentDTO, FulfillmentWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createFulfillmentStep } from "../steps"

export const createFulfillmentWorkflowId = "create-fulfillment-workflow"
export const createFulfillmentWorkflow = createWorkflow(
  createFulfillmentWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateFulfillmentWorkflowInput>
  ): WorkflowResponse<WorkflowData<FulfillmentDTO>> => {
    return new WorkflowResponse(createFulfillmentStep(input))
  }
)
