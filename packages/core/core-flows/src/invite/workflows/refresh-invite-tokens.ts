import type { InviteDTO, InviteWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

import { InviteWorkflowEvents } from "@medusajs/framework/utils"
import { emitEventStep } from "../../common"
import { refreshInviteTokensStep } from "../steps/refresh-invite-tokens"

export const refreshInviteTokensWorkflowId = "refresh-invite-tokens-workflow"
/**
 * This workflow refreshes the token of one or more user invites, updating the
 * token and the expiry date. It's used by the
 * [Refresh Invite Token Admin API Route](https://docs.medusajs.com/api/admin/invites/refresh-invite-token).
 *
 * This workflow is useful to trigger resending invite tokens. It emits the `invite.resent` event,
 * which you can listen to in a [Subscriber](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * refresh invite tokens within your custom flows.
 *
 * @example
 * const { result } = await refreshInviteTokensWorkflow(container)
 * .run({
 *   input: {
 *     invite_ids: ["invite_123"]
 *   }
 * })
 *
 * @summary
 *
 * Refresh user invite tokens.
 */
export const refreshInviteTokensWorkflow = createWorkflow(
  refreshInviteTokensWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.ResendInvitesWorkflowInputDTO>
  ): WorkflowResponse<InviteDTO[]> => {
    const invites = refreshInviteTokensStep(input.invite_ids)

    const invitesIdEvents = transform({ invites }, ({ invites }) => {
      return invites.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: InviteWorkflowEvents.RESENT,
      data: invitesIdEvents,
    })

    return new WorkflowResponse(invites)
  }
)
