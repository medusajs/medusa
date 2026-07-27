import {
  ContainerRegistrationKeys,
  RbacScopeRef,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { assertActorCanGrant } from "../utils/assert-actor-can-grant"

/**
 * @ignore
 * @featureFlag rbac
 */
export type ValidateActorRolePermissionsStepInput = {
  actor_id: string
  actor?: string
  role_ids: string[]
  /**
   * Server-derived scope context the grant happens within. Omitted = the
   * actor's full scope-union policies.
   */
  scope?: RbacScopeRef | RbacScopeRef[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const validateActorRolePermissionsStepId =
  "validate-actor-role-permissions"

/**
 * Validates that the actor has all the policies from the roles being assigned.
 * An actor can only assign roles whose policies they themselves have.
 * @ignore
 * @featureFlag rbac
 */
export const validateActorRolePermissionsStep = createStep(
  validateActorRolePermissionsStepId,
  async (data: ValidateActorRolePermissionsStepInput, { container }) => {
    const { actor_id, actor, role_ids, scope } = data

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

    await assertActorCanGrant({
      container,
      actor_id,
      actor,
      actions: actionsToCheck,
      errorMessage: "You do not have permission to assign these roles",
      scope,
    })

    return new StepResponse(void 0)
  }
)
