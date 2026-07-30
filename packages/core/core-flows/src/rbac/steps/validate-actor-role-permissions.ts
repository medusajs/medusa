import { RbacScope } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
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
   * If the role assignment is scoped, then we control the granting actor has the role in the same scope.
   */
  scope?: RbacScope | RbacScope[]
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
    // TODO: [rbac] The scope handling here is wrong and needs to be correctly
    // implemented. `scope` on the assign/unassign flows now carries the scope
    // constraint stored on the assignment itself, not the granting actor's
    // evaluation context.
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
