import { UserDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateUsersStep } from "../steps"
import { UserWorkflow } from "@medusajs/types"

export const updateUsersWorkflowId = "update-users-workflow"
export const updateUsersWorkflow = createWorkflow(
  updateUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.UpdateUsersWorkflowInputDTO>
  ): WorkflowData<UserDTO[]> => {
    return updateUsersStep(input.updates)
  }
)
