import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deletePricePreferencesStep } from "../steps"

export const deletePricePreferencesWorkflowId = "delete-price-preferences"
export const deletePricePreferencesWorkflow = createWorkflow(
  deletePricePreferencesWorkflowId,
  (input: WorkflowData<string[]>) => {
    return deletePricePreferencesStep(input)
  }
)
