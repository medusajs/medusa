import { InviteWorkflow, UserDTO } from "@medusajs/framework/types"
import { InviteWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { emitEventStep } from "../../common/steps/emit-event"
import { createUsersWorkflow } from "../../user"
import { deleteInvitesStep } from "../steps"
import { validateTokenStep } from "../steps/validate-token"

export const acceptInviteWorkflowId = "accept-invite-workflow"
/**
 * This workflow accepts an invite and creates a user.
 */
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

    const users = createUsersWorkflow.runAsStep({
      input: {
        users: createUserInput,
      },
    })

    const authUserInput = transform({ input, users }, ({ input, users }) => {
      const createdUser = users[0]

      return {
        authIdentityId: input.auth_identity_id,
        actorType: "user",
        value: createdUser.id,
      }
    })

    parallelize(
      setAuthAppMetadataStep(authUserInput),
      deleteInvitesStep([invite.id]),
      emitEventStep({
        eventName: InviteWorkflowEvents.ACCEPTED,
        data: { id: invite.id },
      })
    )

    return new WorkflowResponse(users)
  }
)
