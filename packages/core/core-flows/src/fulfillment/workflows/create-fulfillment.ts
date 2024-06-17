import { FulfillmentDTO, FulfillmentWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createFulfillmentStep } from "../steps"

export const createFulfillmentWorkflowId = "create-fulfillment-workflow"
export const createFulfillmentWorkflow = createWorkflow(
  createFulfillmentWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateFulfillmentWorkflowInput>
  ): WorkflowData<FulfillmentDTO> => {
    const fulfillment = createFulfillmentStep(input)

    return fulfillment
  }
)
