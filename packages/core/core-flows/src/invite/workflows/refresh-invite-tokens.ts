import { InviteDTO, InviteWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"

import { refreshInviteTokensStep } from "../steps/refresh-invite-tokens"

export const refreshInviteTokensWorkflowId = "refresh-invite-tokens-workflow"
export const refreshInviteTokensWorkflow = createWorkflow(
  refreshInviteTokensWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.ResendInvitesWorkflowInputDTO>
  ): WorkflowResponse<InviteDTO[]> => {
    return new WorkflowResponse(refreshInviteTokensStep(input.invite_ids))
  }
)
