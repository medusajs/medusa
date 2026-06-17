import { hasPermission } from "@medusajs/framework"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input to validate that an actor has the given policies.
 */
export type ValidateUserPermissionsStepInput = {
  /**
   * The ID of the actor (for example, a user) whose permissions are validated.
   */
  actor_id: string
  /**
   * The type of the actor, such as `user`. Defaults to `user`.
   */
  actor?: string
  /**
   * The IDs of the policies the actor is trying to assign. The actor must have access
   * to all of these policies.
   */
  policy_ids?: string[]
  /**
   * The resource-operation actions the actor is trying to grant. Used as an alternative
   * to `policy_ids`.
   */
  actions?: {
    /**
     * The resource the action applies to.
     */
    resource: string
    /**
     * The operation performed on the resource.
     */
    operation: string
  }[]
}

/**
 * @featureFlag rbac
 */
export const validateUserPermissionsStepId = "validate-user-permissions"

/**
 * This step validates that an actor has access to all the policies they're trying to
 * assign. An actor can only create roles and add policies that they themselves have
 * access to. The step throws an error if any of the specified policies don't exist, or
 * if the actor doesn't have access to all of the policies or actions being assigned.
 *
 * @example
 * validateUserPermissionsStep({
 *   actor_id: "user_123",
 *   policy_ids: ["pol_123"]
 * })
 *
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
      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        "You do not have access to some of the policies you are trying to assign."
      )
    }
  }
)
