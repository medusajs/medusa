import { CreateUserDTO, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createUsersStep } from "../steps"
import { UserWorkflow } from "@medusajs/types"

export const createUsersWorkflowId = "create-users-workflow"
/**
 * This workflow creates one or more users.
 */
export const createUsersWorkflow = createWorkflow(
  createUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.CreateUsersWorkflowInputDTO>
  ): WorkflowResponse<UserDTO[]> => {
    return new WorkflowResponse(createUsersStep(input.users))
  }
)
