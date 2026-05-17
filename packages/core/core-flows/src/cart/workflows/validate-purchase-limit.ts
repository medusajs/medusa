import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import {
  ValidatePurchaseLimitStepInput,
  validatePurchaseLimitStep,
} from "../steps/validate-purchase-limit"

export const validatePurchaseLimitWorkflowId = "validate-purchase-limit"

/**
 * This workflow validates that the quantity of each item does not exceed
 * the product variant's purchase limit.
 */
export const validatePurchaseLimitWorkflow = createWorkflow(
  validatePurchaseLimitWorkflowId,
  (input: WorkflowData<ValidatePurchaseLimitStepInput>) => {
    validatePurchaseLimitStep(input)
    return new WorkflowResponse(void 0)
  }
)
