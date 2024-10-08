import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteOrderChangeActionsStep } from "../steps"

export const deleteOrderChangeActionsWorkflowId = "delete-order-change-actions"
/**
 * This workflow deletes one or more order change actions.
 */
export const deleteOrderChangeActionsWorkflow = createWorkflow(
  deleteOrderChangeActionsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<void> => {
    deleteOrderChangeActionsStep(input)
  }
)
