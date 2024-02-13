import { CreateUserDTO, UserDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createUsersStep } from "../steps/create-users"

export const createUsersWorkflowId = "create-users-workflow"

export type CreateUsersInput = {
  users: CreateUserDTO[]
}

export const createUsersWorkflow = createWorkflow(
  createUsersWorkflowId,
  (input: WorkflowData<CreateUsersInput>): WorkflowData<UserDTO[]> => {
    return createUsersStep(input.users)
  }
)
