import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteUsersStep } from "../steps"
import { UserWorkflow } from "@medusajs/types"

export const deleteUsersWorkflowId = "delete-user"
/**
 * This workflow deletes one or more users.
 */
export const deleteUsersWorkflow = createWorkflow(
  deleteUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.DeleteUserWorkflowInput>
  ): WorkflowData<void> => {
    return deleteUsersStep(input.ids)
  }
)
