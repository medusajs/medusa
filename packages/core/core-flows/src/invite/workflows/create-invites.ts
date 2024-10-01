import { InviteDTO, InviteWorkflow } from "@medusajs/framework/types"
import { InviteWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createInviteStep } from "../steps"
export const createInvitesWorkflowId = "create-invite-step"
/**
 * This workflow creates one or more invites.
 */
export const createInvitesWorkflow = createWorkflow(
  createInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.CreateInvitesWorkflowInputDTO>
  ): WorkflowResponse<InviteDTO[]> => {
    const createdInvites = createInviteStep(input.invites)

    const invitesIdEvents = transform(
      { createdInvites },
      ({ createdInvites }) => {
        return createdInvites.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: InviteWorkflowEvents.CREATED,
      data: invitesIdEvents,
    })

    return new WorkflowResponse(createdInvites)
  }
)
