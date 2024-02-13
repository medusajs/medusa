import { UpdateUserDTO, UserDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateUsersStep } from "../steps"

interface UpdateUsersInput {
  updates: UpdateUserDTO[]
}

export const updateUsersWorkflowId = "update-users-workflow"
export const updateUsersWorkflow = createWorkflow(
  updateUsersWorkflowId,
  (input: WorkflowData<UpdateUsersInput>): WorkflowData<UserDTO[]> => {
    return updateUsersStep(input.updates)
  }
)
