import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteInvitesStep } from "../steps"
import { InviteWorkflow, UserWorkflow } from "@medusajs/types"

export const deleteInvitesWorkflowId = "delete-invites-workflow"
/**
 * This workflow deletes one or more invites.
 */
export const deleteInvitesWorkflow = createWorkflow(
  deleteInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.DeleteInvitesWorkflowInput>
  ): WorkflowData<void> => {
    return deleteInvitesStep(input.ids)
  }
)
