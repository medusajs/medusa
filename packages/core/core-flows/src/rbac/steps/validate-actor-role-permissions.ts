import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { assertActorCanGrant } from "../utils/assert-actor-can-grant"
import { RbacScope } from "@medusajs/framework/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type ValidateActorRolePermissionsStepInput = {
  actor_id: string
  actor?: string
  /**
   * The scope the actor is acting within. If set, only the actor's role assignments scoped
   * to it count towards assignment pairs targeting that same scope.
   */
  granting_scope?: RbacScope
  /**
   * The role <> scope pairs being assigned or unassigned. A pair without a
   * scope applies across all scopes, so it requires the actor's unscoped
   * privileges.
   */
  assignments: { role_id: string; scope?: RbacScope }[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const validateActorRolePermissionsStepId =
  "validate-actor-role-permissions"

const scopeKey = (scope?: RbacScope) =>
  scope ? `${scope.type}:${scope.id}` : ""

/**
 * Validates that the actor has all the policies from the roles being assigned.
 * An actor can only assign roles whose policies they themselves have, within
 * the scope (if set) the role assignment is scoped to:
 *
 * - The actor's unscoped role assignments count towards every pair.
 * - The actor's role assignments scoped to `granting_scope` only count towards
 *   pairs targeting that same scope.
 *
 * So an actor acting within a scope can't grant a role outside of it, or
 * across all scopes, unless they hold its policies unscoped.
 * @ignore
 * @featureFlag rbac
 */
export const validateActorRolePermissionsStep = createStep(
  validateActorRolePermissionsStepId,
  async (data: ValidateActorRolePermissionsStepInput, { container }) => {
    const { actor_id, actor, granting_scope, assignments } = data

    if (!assignments?.length) {
      return new StepResponse(void 0)
    }

    const groups = new Map<
      string,
      { scope?: RbacScope; roleIds: Set<string> }
    >()
    for (const { role_id, scope: targetScope } of assignments) {
      // Scoped privileges are only usable within the scope being acted in.
      const scope =
        targetScope && scopeKey(targetScope) === scopeKey(granting_scope)
          ? targetScope
          : undefined
      const key = scopeKey(scope)
      const group = groups.get(key) ?? { scope, roleIds: new Set<string>() }
      group.roleIds.add(role_id)
      groups.set(key, group)
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: targetRoles } = await query.graph({
      entity: "rbac_role",
      fields: ["id", "policies.resource", "policies.operation"],
      filters: { id: Array.from(new Set(assignments.map((p) => p.role_id))) },
    })

    for (const { scope, roleIds } of groups.values()) {
      const actionsToCheck: { resource: string; operation: string }[] = []
      for (const role of targetRoles) {
        if (!roleIds.has(role.id)) {
          continue
        }
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
    }

    return new StepResponse(void 0)
  }
)
