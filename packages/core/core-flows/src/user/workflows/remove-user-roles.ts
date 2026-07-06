import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { dismissRemoteLinkStep } from "../../common/steps/dismiss-remote-links"
import { validateUserRolePermissionsStep } from "../steps/validate-user-role-permissions"

/**
 * @ignore
 * @featureFlag rbac
 */
export type RemoveUserRolesWorkflowInput = {
  actor_id: string
  actor?: string
  user_id?: string
  user_ids?: string[]
  role_id?: string
  role_ids?: string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const removeUserRolesWorkflowId = "remove-user-roles"

/**
 * This workflow removes roles from users.
 * Supports two modes:
 * - Remove multiple roles from a single user: { user_id, role_ids }
 * - Remove multiple users from a single role: { user_ids, role_id }
 * It validates that the actor has all the policies from the roles being removed.
 * @ignore
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
