import type { InviteDTO, InviteWorkflow } from "@medusajs/framework/types"
import { InviteWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createInviteStep } from "../steps"
import {
  createRoleAssignmentsStep,
  validateRolesExistStep,
} from "../../rbac/steps"
import { buildRoleAssignments } from "../../rbac/utils/build-role-assignments"
export const createInvitesWorkflowId = "create-invite-step"
/**
 * This workflow creates one or more user invites. It's used by the
 * [Create Invite Admin API Route](https://docs.medusajs.com/api/admin#invites_postinvites).
 *
 * You can provide roles to be assigned to each user when the invite is accepted.
 * Each role can be constrained to one or more scopes, creating one role
 * assignment per scope.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create invites within your custom flows.
 *
 * @example
 * const { result } = await createInvitesWorkflow(container)
 * .run({
 *   input: {
 *     invites: [
 *       {
 *         email: "example@gmail.com",
 *         roles: [
 *           { role_id: "role_super_admin" },
 *           {
 *             role_id: "role_editor",
 *             scopes: [{ type: "organization", id: "org_123" }]
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more user invites with optional role assignment.
 */
export const createInvitesWorkflow = createWorkflow(
  createInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.CreateInvitesWorkflowInputDTO>
  ): WorkflowResponse<InviteDTO[]> => {
    const allRoleIds = transform({ input }, ({ input }) => {
      const roleIds = new Set<string>()
      input.invites.forEach((invite) => {
        for (const role of invite.roles || []) {
          roleIds.add(role.role_id)
        }
      })
      return Array.from(roleIds)
    })

    validateRolesExistStep(allRoleIds)

    const createdInvites = createInviteStep(input.invites)

    const inviteRoleAssignments = transform(
      { input, createdInvites },
      ({ input, createdInvites }) => {
        return input.invites.flatMap((invite, index) =>
          buildRoleAssignments(invite.roles, "invite", createdInvites[index].id)
        )
      }
    )

    createRoleAssignmentsStep(inviteRoleAssignments)

    const invitesIdEvents = transform(
      { createdInvites },
      ({ createdInvites }) => {
        return createdInvites.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: InviteWorkflowEvents.CREATED,
      data: invitesIdEvents,
    })

    return new WorkflowResponse(createdInvites)
  }
)
