import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteOrderChangesStep } from "../steps"

export const deleteOrderChangeWorkflowId = "delete-order-change"
/**
 * This workflow deletes one or more order changes.
 */
export const deleteOrderChangeWorkflow = createWorkflow(
  deleteOrderChangeWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<void> => {
    deleteOrderChangesStep(input)
  }
)
