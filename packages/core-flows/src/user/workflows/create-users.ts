import { CreateUserDTO, UserDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createUsersStep } from "../steps"

interface CreateUsersInput {
  users: CreateUserDTO[]
}

export const createUsersWorkflowId = "create-users-workflow"
export const createUsersWorkflow = createWorkflow(
  createUsersWorkflowId,
  (input: WorkflowData<CreateUsersInput>): WorkflowData<UserDTO[]> => {
    return createUsersStep(input.users)
  }
)
