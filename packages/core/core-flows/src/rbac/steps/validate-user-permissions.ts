import { hasPermission } from "@medusajs/framework"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
 */
export type ValidateUserPermissionsStepInput = {
  actor_id: string
  actor?: string
  policy_ids?: string[]
  actions?: {
    resource: string
    operation: string
  }[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const validateUserPermissionsStepId = "validate-user-permissions"

/**
 * Validates that a user has access to all the policies they are trying to assign.
 * A user can only create roles and add policies that they themselves have access to.
 * @ignore
 * @featureFlag rbac
 */
export const validateUserPermissionsStep = createStep(
  validateUserPermissionsStepId,
  async (data: ValidateUserPermissionsStepInput, { container }) => {
    const { actor_id, actor, policy_ids, actions } = data

    if (!policy_ids?.length && !actions?.length) {
      return
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: users } = await query.graph({
      entity: actor ?? "user",
      fields: ["rbac_roles.id"],
      filters: { id: actor_id },
    })

    const roleIds: string[] =
      users?.[0]?.rbac_roles?.map((r) => r.id).filter(Boolean) ?? []

    if (!roleIds.length) {
      throw new MedusaError(MedusaError.Types.FORBIDDEN, "Forbidden")
    }

    let actionsToCheck: { resource: string; operation: string }[] = []

    if (policy_ids?.length) {
      const { data: targetPolicies } = await query.graph({
        entity: "rbac_policy",
        fields: ["id", "resource", "operation"],
        filters: { id: policy_ids },
      })

      // A user cannot grant a policy that doesn't exist.
      const inexistentPolicies = arrayDifference(
        policy_ids,
        targetPolicies.map((p) => p.id)
      )
      if (inexistentPolicies.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `The following policies do not exist: ${inexistentPolicies.join(
            ", "
          )}`
        )
      }

      actionsToCheck = targetPolicies.map((p) => ({
        resource: p.resource,
        operation: p.operation,
      }))
    } else if (actions?.length) {
      actionsToCheck = actions
    }

    const allowed = await hasPermission({
      roles: roleIds,
      actions: actionsToCheck,
      container,
    })

    if (!allowed) {
      throw new MedusaError(MedusaError.Types.FORBIDDEN, "Forbidden")
    }
  }
)
