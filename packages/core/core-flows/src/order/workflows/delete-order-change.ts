import { WorkflowData, createWorkflow } from "@zjedene-medusa/framework/workflows-sdk"
import { deleteOrderChangesStep } from "../steps"

/**
 * The details of the order changes to delete.
 */
export type DeleteOrderChangeWorkflowInput = {
  /**
   * The IDs of the order changes to delete.
   */
  ids: string[]
}

export const deleteOrderChangeWorkflowId = "delete-order-change"
/**
 * This workflow deletes one or more order changes.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * deleting an order change.
 * 
 * @summary
 * 
 * Delete one or more order changes.
 */
export const deleteOrderChangeWorkflow = createWorkflow(
  deleteOrderChangeWorkflowId,
  (input: WorkflowData<DeleteOrderChangeWorkflowInput>): WorkflowData<void> => {
    deleteOrderChangesStep(input)
  }
)
