import { InviteDTO, InviteWorkflow, UserDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateInvitesStep } from "../steps"

export const updateInvitesWorkflowId = "update-invites-workflow"
export const updateInvitesWorkflow = createWorkflow(
  updateInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.UpdateInvitesWorkflowInputDTO>
  ): WorkflowData<InviteDTO[]> => {
    return updateInvitesStep(input.updates)
  }
)
