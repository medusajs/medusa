import { UserDTO, UserWorkflow } from "@medusajs/framework/types"
import { UserWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { updateUsersStep } from "../steps"

export const updateUsersWorkflowId = "update-users-workflow"
/**
 * This workflow updates one or more users.
 */
export const updateUsersWorkflow = createWorkflow(
  updateUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.UpdateUsersWorkflowInputDTO>
  ): WorkflowResponse<UserDTO[]> => {
    const updatedUsers = updateUsersStep(input.updates)

    const userIdEvents = transform({ updatedUsers }, ({ updatedUsers }) => {
      const arr = Array.isArray(updatedUsers) ? updatedUsers : [updatedUsers]

      return arr?.map((user) => {
        return { id: user.id }
      })
    })

    emitEventStep({
      eventName: UserWorkflowEvents.UPDATED,
      data: userIdEvents,
    })

    return new WorkflowResponse(updatedUsers)
  }
)
