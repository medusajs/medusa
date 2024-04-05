import { AddFulfillmentShippingOptionRulesWorkflowDTO } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { addRulesToFulfillmentShippingOptionStep } from "../steps"

export const createShippingOptionsWorkflowId =
  "create-shipping-options-workflow"
export const createShippingOptionsWorkflow = createWorkflow(
  createShippingOptionsWorkflowId,
  (
    input: WorkflowData<AddFulfillmentShippingOptionRulesWorkflowDTO>
  ): WorkflowData<void> => {
    addRulesToFulfillmentShippingOptionStep(input)
  }
)
