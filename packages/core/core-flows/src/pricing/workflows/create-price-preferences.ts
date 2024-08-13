import { PricingWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createPricePreferencesStep } from "../steps"

export const createPricePreferencesWorkflowId = "create-price-preferences"
/**
 * This workflow creates one or more price preferences.
 */
export const createPricePreferencesWorkflow = createWorkflow(
  createPricePreferencesWorkflowId,
  (input: WorkflowData<PricingWorkflow.CreatePricePreferencesWorkflowInput[]>) => {
    return new WorkflowResponse(createPricePreferencesStep(input))
  }
)
