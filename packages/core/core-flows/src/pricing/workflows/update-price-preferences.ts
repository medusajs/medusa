import { PricingWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updatePricePreferencesStep } from "../steps"

export const updatePricePreferencesWorkflowId = "update-price-preferences"
/**
 * This workflow updates one or more price preferences.
 */
export const updatePricePreferencesWorkflow = createWorkflow(
  updatePricePreferencesWorkflowId,
  (
    input: WorkflowData<PricingWorkflow.UpdatePricePreferencesWorkflowInput>
  ) => {
    return new WorkflowResponse(updatePricePreferencesStep(input))
  }
)
