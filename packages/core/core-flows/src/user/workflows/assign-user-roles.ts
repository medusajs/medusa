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
 * @ignore
 * @featureFlag rbac
 */
export type AssignUserRolesWorkflowInput = {
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
export const assignUserRolesWorkflowId = "assign-user-roles"

/**
 * This workflow assigns roles to users.
 * Supports two modes:
 * - Assign multiple roles to a single user: { user_id, role_ids }
 * - Assign multiple users to a single role: { user_ids, role_id }
 * It validates that the actor has all the policies from the roles being assigned.
 * @ignore
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
