import { InviteWorkflow, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createUsersStep } from "../../user"
import { deleteInvitesStep } from "../steps"
import { validateTokenStep } from "../steps/validate-token"
import { setAuthAppMetadataStep } from "../../auth"

export const acceptInviteWorkflowId = "accept-invite-workflow"
export const acceptInviteWorkflow = createWorkflow(
  acceptInviteWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.AcceptInviteWorkflowInputDTO>
  ): WorkflowResponse<UserDTO[]> => {
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

    const authUserInput = transform({ input, users }, ({ input, users }) => {
      const createdUser = users[0]

      return {
        authIdentityId: input.auth_identity_id,
        actorType: "user",
        value: createdUser.id,
      }
    })

    setAuthAppMetadataStep(authUserInput)
    deleteInvitesStep([invite.id])

    return new WorkflowResponse(users)
  }
)
