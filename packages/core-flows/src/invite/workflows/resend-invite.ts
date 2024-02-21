import { InviteDTO, InviteWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { resendInvitesStep } from "../steps/resend-invites"

export const resendInvitesWorkflowId = "resend-invite-step"
export const resendInvitesWorkflow = createWorkflow(
  resendInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.ResendInvitesWorkflowInputDTO>
  ): WorkflowData<InviteDTO[]> => {
    return resendInvitesStep(input.invite_ids)
  }
)
