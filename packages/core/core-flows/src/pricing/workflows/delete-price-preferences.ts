import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deletePricePreferencesStep } from "../steps"

export const deletePricePreferencesWorkflowId = "delete-price-preferences"
/**
 * This workflow deletes one or more price preferences.
 */
export const deletePricePreferencesWorkflow = createWorkflow(
  deletePricePreferencesWorkflowId,
  (input: WorkflowData<string[]>) => {
    return deletePricePreferencesStep(input)
  }
)
