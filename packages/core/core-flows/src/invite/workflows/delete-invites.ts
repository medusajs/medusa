import type { InviteWorkflow } from "@zjedene-medusa/framework/types"
import { InviteWorkflowEvents } from "@zjedene-medusa/framework/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@zjedene-medusa/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteInvitesStep } from "../steps"

export const deleteInvitesWorkflowId = "delete-invites-workflow"
/**
 * This workflow deletes one or more user invites. It's used by the
 * [Delete Invites Admin API Route](https://docs.medusajs.com/api/admin#invites_deleteinvitesid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete invites within your custom flows.
 *
 * @example
 * const { result } = await deleteInvitesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["invite_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more user invites.
 */
export const deleteInvitesWorkflow = createWorkflow(
  deleteInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.DeleteInvitesWorkflowInput>
  ): WorkflowData<void> => {
    deleteInvitesStep(input.ids)

    const invitesIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: InviteWorkflowEvents.DELETED,
      data: invitesIdEvents,
    })
  }
)
