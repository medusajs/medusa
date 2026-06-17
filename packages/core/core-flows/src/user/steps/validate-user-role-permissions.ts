import { hasPermission } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The input to validate that an actor has the policies of the given roles.
 */
export type ValidateUserRolePermissionsStepInput = {
  /**
   * The ID of the actor (for example, a user) assigning the roles.
   */
  actor_id: string
  /**
   * The type of the actor, such as `user`. Defaults to `user`.
   */
  actor?: string
  /**
   * The IDs of the roles being assigned. The actor must have access to all the policies
   * of these roles.
   */
  role_ids: string[]
}

/**
 * @featureFlag rbac
 */
export const validateUserRolePermissionsStepId =
  "validate-user-role-permissions"

/**
 * This step validates that the actor has all the policies of the roles being assigned.
 * An actor can only assign roles whose policies they themselves have. The step throws
 * an error if the actor doesn't have access to all of the roles' policies.
 *
 * @example
 * validateUserRolePermissionsStep({
 *   actor_id: "user_123",
 *   role_ids: ["role_123"]
 * })
 *
 * @featureFlag rbac
 */
export const validateUserRolePermissionsStep = createStep(
  validateUserRolePermissionsStepId,
  async (data: ValidateUserRolePermissionsStepInput, { container }) => {
    const { actor_id, actor, role_ids } = data

    if (!role_ids?.length) {
      return new StepResponse(void 0)
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: targetRoles } = await query.graph({
      entity: "rbac_role",
      fields: ["id", "policies.resource", "policies.operation"],
      filters: { id: role_ids },
    })

    const actionsToCheck: { resource: string; operation: string }[] = []
    for (const role of targetRoles) {
      for (const policy of role.policies ?? []) {
        actionsToCheck.push({
          resource: policy.resource,
          operation: policy.operation,
        })
      }
    }

    if (!actionsToCheck.length) {
      return new StepResponse(void 0)
    }

    const { data: actors } = await query.graph({
      entity: actor ?? "user",
      fields: ["rbac_roles.id"],
      filters: { id: actor_id },
    })

    const actorRoleIds: string[] =
      actors?.[0]?.rbac_roles?.map((r: any) => r.id).filter(Boolean) ?? []

    if (!actorRoleIds.length) {
      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        "You do not have permission to assign these roles"
      )
    }

    const allowed = await hasPermission({
      roles: actorRoleIds,
      actions: actionsToCheck,
      container,
    })

    if (!allowed) {
      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        "You do not have permission to assign these roles"
      )
    }

    return new StepResponse(void 0)
  }
)
