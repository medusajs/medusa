import type { UserWorkflow } from "@medusajs/framework/types"
import { Modules, UserWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, removeRemoteLinkStep } from "../../common"
import { deleteRoleAssignmentsStep } from "../../rbac/steps"
import { deleteUsersStep } from "../steps"

export const deleteUsersWorkflowId = "delete-user"
/**
 * This workflow deletes one or more users. It's used by other workflows
 * like {@link removeUserAccountWorkflow}. If you use this workflow directly,
 * you must also remove the association to the auth identity using the
 * {@link setAuthAppMetadataStep}. Learn more about auth identities in
 * [this documentation](https://docs.medusajs.com/resources/commerce-modules/auth/auth-identity-and-actor-types).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete users within your custom flows.
 *
 * @example
 * const { result } = await deleteUsersWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["user_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more users.
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

    const roleAssignmentsToDelete = transform({ input }, ({ input }) => ({
      reference: "user",
      reference_id: input.ids ?? [],
    }))

    parallelize(
      removeRemoteLinkStep({
        [Modules.USER]: {
          user_id: input.ids,
        },
      }),
      deleteRoleAssignmentsStep(roleAssignmentsToDelete),
      emitEventStep({
        eventName: UserWorkflowEvents.DELETED,
        data: userIdEvents,
      })
    )
  }
)
