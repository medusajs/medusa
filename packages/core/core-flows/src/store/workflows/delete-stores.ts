import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteStoresStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteStoresWorkflowId = "delete-stores"
export const deleteStoresWorkflow = createWorkflow(
  deleteStoresWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteStoresStep(input.ids)
  }
)
