import { PricingWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createPricePreferencesStep } from "../steps"

type WorkflowInputData = PricingWorkflow.CreatePricePreferencesWorkflowInput[]

export const createPricePreferencesWorkflowId = "create-price-preferences"
export const createPricePreferencesWorkflow = createWorkflow(
  createPricePreferencesWorkflowId,
  (input: WorkflowData<WorkflowInputData>) => {
    return createPricePreferencesStep(input)
  }
)
