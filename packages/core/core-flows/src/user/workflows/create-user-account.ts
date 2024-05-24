import { CreateUserDTO, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createUsersStep } from "../steps"
import { Modules } from "@medusajs/modules-sdk"
import { createLinkStep } from "../../common"

type WorkflowInput = {
  authIdentityId: string
  userData: CreateUserDTO
}

export const createUserAccountWorkflowId = "create-user-account"
export const createUserAccountWorkflow = createWorkflow(
  createUserAccountWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<UserDTO> => {
    const users = createUsersStep([input.userData])
    const user = transform(users, (users: UserDTO[]) => users[0])

    const link = transform(
      { user, authIdentityId: input.authIdentityId },
      (data) => {
        return [
          {
            [Modules.USER]: { user_id: data.user.id },
            [Modules.AUTH]: { auth_identity_id: data.authIdentityId },
          },
        ]
      }
    )

    createLinkStep(link)
    return user
  }
)
