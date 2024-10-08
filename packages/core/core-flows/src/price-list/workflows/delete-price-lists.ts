import { createWorkflow, WorkflowData } from "@medusajs/framework/workflows-sdk"
import { deletePriceListsStep } from "../steps"

export const deletePriceListsWorkflowId = "delete-price-lists"
/**
 * This workflow deletes one or more price lists.
 */
export const deletePriceListsWorkflow = createWorkflow(
  deletePriceListsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<void> => {
    return deletePriceListsStep(input.ids)
  }
)
