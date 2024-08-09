import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createInviteStep } from "../steps"
import { InviteDTO, InviteWorkflow } from "@medusajs/types"

export const createInvitesWorkflowId = "create-invite-step"
/**
 * This workflow creates one or more invites.
 */
export const createInvitesWorkflow = createWorkflow(
  createInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.CreateInvitesWorkflowInputDTO>
  ): WorkflowResponse<InviteDTO[]> => {
    return new WorkflowResponse(createInviteStep(input.invites))
  }
)
