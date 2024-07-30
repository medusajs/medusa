import { CreateUserDTO, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createUsersStep } from "../steps"
import { UserWorkflow } from "@medusajs/types"

export const createUsersWorkflowId = "create-users-workflow"
export const createUsersWorkflow = createWorkflow(
  createUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.CreateUsersWorkflowInputDTO>
  ): WorkflowResponse<WorkflowData<UserDTO[]>> => {
    return new WorkflowResponse(createUsersStep(input.users))
  }
)
