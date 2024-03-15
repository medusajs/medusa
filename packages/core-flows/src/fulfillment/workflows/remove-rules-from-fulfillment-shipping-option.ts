import { RemoveFulfillmentShippingOptionRulesWorkflowDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removeRulesFromFulfillmentShippingOptionStep } from "../steps"

export const removeRulesFromFulfillmentShippingOptionWorkflowId =
  "remove-rules-from-fulfillment-shipping-option-workflow"
export const removeRulesFromFulfillmentShippingOptionWorkflow = createWorkflow(
  removeRulesFromFulfillmentShippingOptionWorkflowId,
  (
    input: WorkflowData<RemoveFulfillmentShippingOptionRulesWorkflowDTO>
  ): WorkflowData<void> => {
    removeRulesFromFulfillmentShippingOptionStep(input)
  }
)
