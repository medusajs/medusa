import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteUsersStep } from "../steps"
import { UserWorkflow } from "@medusajs/types"

export const deleteUsersWorkflowId = "delete-user"
export const deleteUsersWorkflow = createWorkflow(
  deleteUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.DeleteUserWorkflowInput>
  ): WorkflowData<void> => {
    return deleteUsersStep(input.ids)
  }
)
