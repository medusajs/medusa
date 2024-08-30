import { UserDTO, UserWorkflow } from "@medusajs/types"
import { UserWorkflowEvents } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createUsersStep } from "../steps"

export const createUsersWorkflowId = "create-users-workflow"
/**
 * This workflow creates one or more users.
 */
export const createUsersWorkflow = createWorkflow(
  createUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.CreateUsersWorkflowInputDTO>
  ): WorkflowResponse<UserDTO[]> => {
    const createdUsers = createUsersStep(input.users)

    const userIdEvents = transform({ createdUsers }, ({ createdUsers }) => {
      return createdUsers.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: UserWorkflowEvents.CREATED,
      data: userIdEvents,
    })

    return new WorkflowResponse(createdUsers)
  }
)
