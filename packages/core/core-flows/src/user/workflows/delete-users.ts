import type { UserWorkflow } from "@medusajs/framework/types"
import { Modules, UserWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, removeRemoteLinkStep } from "../../common"
import { getRoleAssignmentsStep } from "../../rbac/steps"
import { unassignRolesWorkflow } from "../../rbac/workflows/unassign-roles"
import { deleteUsersStep } from "../steps"

export const deleteUsersWorkflowId = "delete-user"
/**
 * This workflow deletes one or more users. It's used by other workflows
 * like {@link removeUserAccountWorkflow}. If you use this workflow directly,
 * you must also remove the association to the auth identity using the
 * {@link setAuthAppMetadataStep}. Learn more about auth identities in
 * [this documentation](https://docs.medusajs.com/resources/commerce-modules/auth/auth-identity-and-actor-types).
 *
 * The users' role assignments are removed through when a granting actor is provided.
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
    const roleAssignments = getRoleAssignmentsStep({
      reference: "user",
      reference_id: input.ids,
    })

    const unassignRolesInput = transform(
      { input, roleAssignments },
      ({ input, roleAssignments }) => ({
        granting_actor_id: input.granting_actor_id,
        granting_actor: input.granting_actor,
        granting_scope: input.granting_scope,
        assignments: roleAssignments.map((assignment) => ({
          role_id: assignment.role_id,
          reference: assignment.reference,
          reference_id: assignment.reference_id,
          scope:
            assignment.scope && assignment.scope_id
              ? { type: assignment.scope, id: assignment.scope_id }
              : undefined,
        })),
      })
    )

    unassignRolesWorkflow.runAsStep({ input: unassignRolesInput })

    deleteUsersStep(input.ids)

    const userIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    parallelize(
      removeRemoteLinkStep({
        [Modules.USER]: {
          user_id: input.ids,
        },
      }),
      emitEventStep({
        eventName: UserWorkflowEvents.DELETED,
        data: userIdEvents,
      })
    )
  }
)
