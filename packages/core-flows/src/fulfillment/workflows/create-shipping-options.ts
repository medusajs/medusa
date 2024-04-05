import { FulfillmentWorkflow } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { createShippingOptionsStep } from "../steps/create-shipping-options"

export const createShippingOptionsWorkflowId =
  "create-shipping-options-workflow"
export const createShippingOptionsWorkflow = createWorkflow(
  createShippingOptionsWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateShippingOptionsWorkflowInput>
  ): WorkflowData<FulfillmentWorkflow.CreateShippingOptionsWorkflowOutput> => {
    return createShippingOptionsStep(input)
  }
)
