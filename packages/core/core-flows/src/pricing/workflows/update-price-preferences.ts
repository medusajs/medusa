import { PricingWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updatePricePreferencesStep } from "../steps"

type WorkflowInputData = PricingWorkflow.UpdatePricePreferencesWorkflowInput

export const updatePricePreferencesWorkflowId = "update-price-preferences"
export const updatePricePreferencesWorkflow = createWorkflow(
  updatePricePreferencesWorkflowId,
  (input: WorkflowData<WorkflowInputData>) => {
    return new WorkflowResponse(updatePricePreferencesStep(input))
  }
)
