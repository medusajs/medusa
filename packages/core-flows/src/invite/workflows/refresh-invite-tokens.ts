import { InviteDTO, InviteWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { refreshInviteTokensStep } from "../steps/refresh-invite-tokens"

export const refreshInviteTokensWorkflowId = "refresh-invite-tokens-workflow"
export const refreshInviteTokensWorkflow = createWorkflow(
  refreshInviteTokensWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.ResendInvitesWorkflowInputDTO>
  ): WorkflowData<InviteDTO[]> => {
    return refreshInviteTokensStep(input.invite_ids)
  }
)
