import { UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createUsersStep } from "../../user"
import { validateTokenStep } from "../steps/validate-token"
import { setAuthAppMetadataStep } from "../../auth"
import { InviteWorkflow } from "@medusajs/types"
import { deleteInvitesStep } from "../steps"

export const acceptInviteWorkflowId = "accept-invite-workflow"
export const acceptInviteWorkflow = createWorkflow(
  acceptInviteWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.AcceptInviteWorkflowInputDTO>
  ): WorkflowData<UserDTO[]> => {
    // validate token
    const invite = validateTokenStep(input.invite_token)

    const createUserInput = transform(
      { input, invite },
      ({ input, invite }) => {
        return [
          {
            ...input.user,
            email: invite.email,
          },
        ]
      }
    )

    const users = createUsersStep(createUserInput)

    const authUserInput = transform({ input, users }, ({ input, users }) => {
      const createdUser = users[0]

      return {
        authUserId: input.auth_user_id,
        key: "user_id",
        value: createdUser.id,
      }
    })

    setAuthAppMetadataStep(authUserInput)

    deleteInvitesStep([invite.id])

    return users
  }
)
