import { PricingWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createPricePreferencesStep } from "../steps"

export const createPricePreferencesWorkflowId = "create-price-preferences"
/**
 * This workflow creates one or more price preferences.
 */
export const createPricePreferencesWorkflow = createWorkflow(
  createPricePreferencesWorkflowId,
  (
    input: WorkflowData<PricingWorkflow.CreatePricePreferencesWorkflowInput[]>
  ) => {
    return new WorkflowResponse(createPricePreferencesStep(input))
  }
)
