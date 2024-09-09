import { InviteDTO, InviteWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"

import { InviteWorkflowEvents } from "@medusajs/utils"
import { emitEventStep } from "../../common"
import { refreshInviteTokensStep } from "../steps/refresh-invite-tokens"

export const refreshInviteTokensWorkflowId = "refresh-invite-tokens-workflow"
/**
 * This workflow refreshes the token of one or more invites.
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
