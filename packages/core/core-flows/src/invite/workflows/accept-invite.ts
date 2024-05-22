import { InviteWorkflow, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createUsersStep } from "../../user"
import { deleteInvitesStep } from "../steps"
import { validateTokenStep } from "../steps/validate-token"
import { Modules } from "@medusajs/modules-sdk"
import { createLinkStep } from "../../common"

export const acceptInviteWorkflowId = "accept-invite-workflow"
export const acceptInviteWorkflow = createWorkflow(
  acceptInviteWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.AcceptInviteWorkflowInputDTO>
  ): WorkflowData<UserDTO[]> => {
    const invite = validateTokenStep(input.invite_token)

    const createUserInput = transform(
      { input, invite },
      ({ input, invite }) => {
        return [
          {
            ...input.user,
            email: input.user.email ?? invite.email,
          },
        ]
      }
    )

    const users = createUsersStep(createUserInput)

    const link = transform(
      { users, authIdentityId: input.auth_identity_id },
      (data) => {
        const user = data.users[0]
        return [
          {
            [Modules.USER]: { user_id: user.id },
            [Modules.AUTH]: { auth_identity_id: data.authIdentityId },
          },
        ]
      }
    )

    createLinkStep(link)
    deleteInvitesStep([invite.id])

    return users
  }
)
