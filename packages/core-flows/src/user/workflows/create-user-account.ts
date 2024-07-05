import { CreateUserDTO, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth/steps"
import { createUsersStep } from "../steps"

type WorkflowInput = {
  authUserId: string
  userData: CreateUserDTO
}

export const createUserAccountWorkflowId = "create-user-account"
export const createUserAccountWorkflow = createWorkflow(
  createUserAccountWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<UserDTO> => {
    const users = createUsersStep([input.userData])

    const user = transform(users, (users: UserDTO[]) => users[0])

    setAuthAppMetadataStep({
      authUserId: input.authUserId,
      key: "user_id",
      value: user.id,
    })

    return user
  }
)
