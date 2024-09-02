import { UserWorkflow } from "@medusajs/types"
import { UserWorkflowEvents } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
import { deleteUsersStep } from "../steps"

export const deleteUsersWorkflowId = "delete-user"
/**
 * This workflow deletes one or more users.
 */
export const deleteUsersWorkflow = createWorkflow(
  deleteUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.DeleteUserWorkflowInput>
  ): WorkflowData<void> => {
    deleteUsersStep(input.ids)

    const userIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: UserWorkflowEvents.DELETED,
      data: userIdEvents,
    })
  }
)
