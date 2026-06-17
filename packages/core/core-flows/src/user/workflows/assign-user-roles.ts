import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../../common/steps/create-remote-links"
import { validateRolesExistStep } from "../../invite/steps/validate-roles-exist"
import { validateUserRolePermissionsStep } from "../steps/validate-user-role-permissions"

/**
 * The data to assign roles to users.
 */
export type AssignUserRolesWorkflowInput = {
  /**
   * The ID of the actor (for example, a user) assigning the roles. It's used to
   * validate that the actor has the policies of the roles being assigned.
   */
  actor_id: string
  /**
   * The type of the actor, such as `user`. Defaults to `user`.
   */
  actor?: string
  /**
   * The ID of the user to assign roles to. Used when assigning multiple roles to a
   * single user.
   */
  user_id?: string
  /**
   * The IDs of the users to assign a role to. Used when assigning a single role to
   * multiple users.
   */
  user_ids?: string[]
  /**
   * The ID of the role to assign. Used when assigning a single role to multiple users.
   */
  role_id?: string
  /**
   * The IDs of the roles to assign. Used when assigning multiple roles to a single user.
   */
  role_ids?: string[]
}

/**
 * @featureFlag rbac
 */
export const assignUserRolesWorkflowId = "assign-user-roles"

/**
 * This workflow assigns RBAC roles to users. It supports two modes:
 *
 * - Assign multiple roles to a single user using `{ user_id, role_ids }`.
 * - Assign a single role to multiple users using `{ user_ids, role_id }`.
 *
 * It validates that the specified roles exist and that the actor has all the policies
 * of the roles being assigned before creating the user-role links.
 *
 * You can use this workflow within your customizations or your own custom workflows,
 * allowing you to assign roles to users within your custom flows.
 *
 * @example
 * const { result } = await assignUserRolesWorkflow(container)
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
 * Assign RBAC roles to users.
 *
 * @featureFlag rbac
 */
export const assignUserRolesWorkflow = createWorkflow(
  assignUserRolesWorkflowId,
  (input: WorkflowData<AssignUserRolesWorkflowInput>) => {
    const roleIds = transform({ input }, ({ input }) => {
      return input.role_ids ?? (input.role_id ? [input.role_id] : [])
    })

    validateRolesExistStep(roleIds)

    validateUserRolePermissionsStep({
      actor_id: input.actor_id,
      actor: input.actor,
      role_ids: roleIds,
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

    createRemoteLinkStep(userRoleLinks)

    return new WorkflowResponse(void 0)
  }
)
