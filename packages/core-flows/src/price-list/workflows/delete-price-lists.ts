import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { deletePriceListsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deletePriceListsWorkflowId = "delete-price-lists"
export const deletePriceListsWorkflow = createWorkflow(
  deletePriceListsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deletePriceListsStep(input.ids)
  }
)
