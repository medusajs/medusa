import type { InviteWorkflow, UserDTO } from "@medusajs/framework/types"
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
import { deleteInvitesStep, getInviteRolesStep } from "../steps"
import { validateTokenStep } from "../steps/validate-token"

export const acceptInviteWorkflowId = "accept-invite-workflow"
/**
 * This workflow accepts an invite and creates a user. It's used by the
 * [Accept Invite Admin API Route](https://docs.medusajs.com/api/admin#invites_postinvitesaccept).
 *
 * The workflow throws an error if the specified token is not valid. Also, the workflow
 * requires an auth identity to be created previously. You can create an auth identity
 * using the [Retrieve Registration JWT Token API Route](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_provider_register).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * accept invites within your custom flows.
 *
 * @example
 * const { result } = await acceptInviteWorkflow(container)
 * .run({
 *   input: {
 *     invite_token: "sk_123",
 *     auth_identity_id: "au_123",
 *     user: {
 *       email: "example@gmail.com",
 *       first_name: "John",
 *       last_name: "Doe",
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Accept invite and create user with roles.
 */
export const acceptInviteWorkflow = createWorkflow(
  acceptInviteWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.AcceptInviteWorkflowInputDTO>
  ): WorkflowResponse<UserDTO[]> => {
    const invite = validateTokenStep(input.invite_token)

    // Get roles associated with the invite
    const inviteRoles = getInviteRolesStep({ invite_id: invite.id })

    const createUserInput = transform(
      { input, invite, inviteRoles },
      ({ input, invite, inviteRoles }) => {
        return [
          {
            ...input.user,
            email: input.user.email ?? invite.email,
            roles: inviteRoles,
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
