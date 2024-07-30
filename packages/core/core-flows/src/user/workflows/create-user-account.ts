import { CreateUserDTO, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createUsersStep } from "../steps"
import { setAuthAppMetadataStep } from "../../auth"

type WorkflowInput = {
  authIdentityId: string
  userData: CreateUserDTO
}

export const createUserAccountWorkflowId = "create-user-account"
export const createUserAccountWorkflow = createWorkflow(
  createUserAccountWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<UserDTO> => {
    const users = createUsersStep([input.userData])
    const user = transform(users, (users: UserDTO[]) => users[0])

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "user",
      value: user.id,
    })
    return new WorkflowResponse(user)
  }
)
