import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { deletePriceListsStep } from "../steps"

export const deletePriceListsWorkflowId = "delete-price-lists"
export const deletePriceListsWorkflow = createWorkflow(
  deletePriceListsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<void> => {
    return deletePriceListsStep(input.ids)
  }
)
