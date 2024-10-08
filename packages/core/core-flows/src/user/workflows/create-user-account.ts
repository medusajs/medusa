import { CreateUserDTO, UserDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { createUsersWorkflow } from "./create-users"

export type CreateUserAccountWorkflowInput = {
  authIdentityId: string
  userData: CreateUserDTO
}

export const createUserAccountWorkflowId = "create-user-account"
/**
 * This workflow creates an authentication identity for a user.
 */
export const createUserAccountWorkflow = createWorkflow(
  createUserAccountWorkflowId,
  (
    input: WorkflowData<CreateUserAccountWorkflowInput>
  ): WorkflowResponse<UserDTO> => {
    const users = createUsersWorkflow.runAsStep({
      input: {
        users: [input.userData],
      },
    })

    const user = transform(users, (users: UserDTO[]) => users[0])

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "user",
      value: user.id,
    })
    return new WorkflowResponse(user)
  }
)
