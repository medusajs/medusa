import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { dismissRemoteLinkStep } from "../../common/steps/dismiss-remote-links"
import { validateUserRolePermissionsStep } from "../steps/validate-user-role-permissions"

/**
 * The data to remove roles from users.
 */
export type RemoveUserRolesWorkflowInput = {
  /**
   * The ID of the actor (for example, a user) removing the roles. It's used to
   * validate that the actor has the policies of the roles being removed.
   */
  actor_id: string
  /**
   * The type of the actor, such as `user`. Defaults to `user`.
   */
  actor?: string
  /**
   * The ID of the user to remove roles from. Used when removing multiple roles from a
   * single user.
   */
  user_id?: string
  /**
   * The IDs of the users to remove a role from. Used when removing a single role from
   * multiple users.
   */
  user_ids?: string[]
  /**
   * The ID of the role to remove. Used when removing a single role from multiple users.
   */
  role_id?: string
  /**
   * The IDs of the roles to remove. Used when removing multiple roles from a single user.
   */
  role_ids?: string[]
}

/**
 * @featureFlag rbac
 */
export const removeUserRolesWorkflowId = "remove-user-roles"

/**
 * This workflow removes RBAC roles from users. It supports two modes:
 *
 * - Remove multiple roles from a single user using `{ user_id, role_ids }`.
 * - Remove a single role from multiple users using `{ user_ids, role_id }`.
 *
 * It validates that the actor has all the policies of the roles being removed before
 * dismissing the user-role links.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to remove roles from users within your custom flows.
 *
 * @example
 * const { result } = await removeUserRolesWorkflow(container)
 * .run({
 *   input: {
 *     actor_id: "user_123",
 *     user_id: "user_456",
 *     role_ids: ["role_123"]
 *   }
 * })
 *
 * @summary
 *
 * Remove RBAC roles from users.
 *
 * @featureFlag rbac
 */
export const removeUserRolesWorkflow = createWorkflow(
  removeUserRolesWorkflowId,
  (input: WorkflowData<RemoveUserRolesWorkflowInput>) => {
    const roleIds = transform({ input }, ({ input }) => {
      return input.role_ids ?? (input.role_id ? [input.role_id] : [])
    })

    validateUserRolePermissionsStep({
      actor_id: input.actor_id,
      role_ids: roleIds,
      actor: input.actor,
    })

    const userRoleLinks = transform({ input }, ({ input }) => {
      const users = input.user_ids ?? (input.user_id ? [input.user_id] : [])
      const roles = input.role_ids ?? (input.role_id ? [input.role_id] : [])

      const links: {
        user: { user_id: string }
        rbac: { rbac_role_id: string }
      }[] = []
      for (const userId of users) {
        for (const roleId of roles) {
          links.push({
            user: { user_id: userId },
            rbac: { rbac_role_id: roleId },
          })
        }
      }
      return links
    })

    dismissRemoteLinkStep(userRoleLinks)

    return new WorkflowResponse(void 0)
  }
)
