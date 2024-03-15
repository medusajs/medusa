import { AddFulfillmentShippingOptionRulesWorkflowDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { addRulesToFulfillmentShippingOptionStep } from "../steps"

export const addRulesToFulfillmentShippingOptionWorkflowId =
  "add-rules-to-fulfillment-shipping-option-workflow"
export const addRulesToFulfillmentShippingOptionWorkflow = createWorkflow(
  addRulesToFulfillmentShippingOptionWorkflowId,
  (
    input: WorkflowData<AddFulfillmentShippingOptionRulesWorkflowDTO>
  ): WorkflowData<void> => {
    addRulesToFulfillmentShippingOptionStep(input)
  }
)
