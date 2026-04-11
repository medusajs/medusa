import type { InviteDTO, InviteWorkflow } from "@medusajs/framework/types"
import { InviteWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../../common/steps/create-remote-links"
import { emitEventStep } from "../../common/steps/emit-event"
import { createInviteStep, validateRolesExistStep } from "../steps"
export const createInvitesWorkflowId = "create-invite-step"
/**
 * This workflow creates one or more user invites. It's used by the
 * [Create Invite Admin API Route](https://docs.medusajs.com/api/admin#invites_postinvites).
 *
 * You can provide roles to be assigned to each user when the invite is accepted.
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
 *         roles: ["role_super_admin"]
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
        for (const roleId of invite.roles || []) {
          roleIds.add(roleId)
        }
      })
      return Array.from(roleIds)
    })

    validateRolesExistStep(allRoleIds)

    const createdInvites = createInviteStep(input.invites)

    const inviteRoleLinks = transform(
      { input, createdInvites },
      ({ input, createdInvites }) => {
        const links: {
          [key: string]: { invite_id?: string; rbac_role_id?: string }
        }[] = []
        input.invites.forEach((invite, index) => {
          const inviteId = createdInvites[index].id
          for (const roleId of invite.roles || []) {
            links.push({
              user: { invite_id: inviteId },
              rbac: { rbac_role_id: roleId },
            })
          }
        })
        return links
      }
    )

    createRemoteLinkStep(inviteRoleLinks)

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
