import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteStoresStep } from "../steps"

export type DeleteStoresWorkflowInput = { ids: string[] }

export const deleteStoresWorkflowId = "delete-stores"
/**
 * This workflow deletes one or more stores.
 */
export const deleteStoresWorkflow = createWorkflow(
  deleteStoresWorkflowId,
  (input: WorkflowData<DeleteStoresWorkflowInput>): WorkflowData<void> => {
    return deleteStoresStep(input.ids)
  }
)
