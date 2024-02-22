import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteInvitesStep } from "../steps"
import { InviteWorkflow, UserWorkflow } from "@medusajs/types"

export const deleteInvitesWorkflowId = "delete-invites-workflow"
export const deleteInvitesWorkflow = createWorkflow(
  deleteInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.DeleteInvitesWorkflowInput>
  ): WorkflowData<void> => {
    return deleteInvitesStep(input.ids)
  }
)
