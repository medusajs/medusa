import {
  getActorPermissions,
  isGranted,
  PermissionSet,
} from "@medusajs/framework"
import { MedusaContainer, RbacScope } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  deduplicate,
} from "@medusajs/framework/utils"

/**
 * @ignore
 */
export type CanActorGrantRolesInput = {
  container: MedusaContainer
  actor_id: string
  actor?: string
  /**
   * The scope the actor is acting within. If set, only the actor's role
   * assignments scoped to it count towards assignments targeting that same
   * scope.
   */
  granting_scope?: RbacScope
  /**
   * The role <> scope pairs being granted. A pair without a scope applies
   * across all scopes, so it requires the actor's unscoped privileges.
   */
  assignments: { role_id: string; scope?: RbacScope }[]
}

type Policy = { resource: string; operation: string }

const scopeKey = (scope?: RbacScope) =>
  scope ? `${scope.type}:${scope.id}` : ""

/**
 * Whether the actor holds all the policies of each role being granted, within
 * the scope (if set) the assignment is scoped to:
 *
 * - The actor's unscoped role assignments count towards every pair.
 * - The actor's role assignments scoped to `granting_scope` only count towards
 *   pairs targeting that same scope.
 *
 * So an actor acting within a scope can't grant a role outside of it, or
 * across all scopes, unless they hold its policies unscoped.
 *
 * @returns One verdict per assignment, following their input order.
 */
export const canActorGrantRoles = async ({
  container,
  actor_id,
  actor,
  granting_scope,
  assignments,
}: CanActorGrantRolesInput): Promise<boolean[]> => {
  if (!assignments.length) {
    return []
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: roles } = await query.graph({
    entity: "rbac_role",
    fields: ["id", "policies.resource", "policies.operation"],
    filters: {
      id: deduplicate(assignments.map((assignment) => assignment.role_id)),
    },
  })
  const policiesByRole = new Map<string, Policy[]>(
    roles.map((role): [string, Policy[]] => [role.id, role.policies ?? []])
  )

  const checks = assignments.map(({ role_id, scope }) => ({
    policies: policiesByRole.get(role_id) ?? [],
    // Scoped privileges are only usable within the scope being acted in.
    scope:
      scope && scopeKey(scope) === scopeKey(granting_scope) ? scope : undefined,
  }))

  // One permission set per scope context, fetched only when a pair has
  // policies to check against it.
  const scopes = new Map(
    checks
      .filter((check) => check.policies.length)
      .map((check) => [scopeKey(check.scope), check.scope])
  )
  const permissionsByScope = new Map<string, PermissionSet>(
    await Promise.all(
      [...scopes].map(
        async ([key, scope]): Promise<[string, PermissionSet]> => [
          key,
          await getActorPermissions({
            authContext: { actor_id, actor_type: actor ?? "user" },
            container,
            scope,
          }),
        ]
      )
    )
  )

  return checks.map(({ policies, scope }) =>
    policies.every((policy) =>
      isGranted(
        permissionsByScope.get(scopeKey(scope))!,
        policy.resource,
        policy.operation
      )
    )
  )
}
