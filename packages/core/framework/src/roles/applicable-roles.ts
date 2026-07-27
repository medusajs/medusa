import type { RbacScopeRef, ResolvedRole } from "@medusajs/utils"

/**
 * Whether a resolved role applies within `scopes`: unscoped roles always
 * apply; scoped roles apply only when the scope set contains their scope.
 */
function roleAppliesToScopes(
  role: ResolvedRole,
  scopes: RbacScopeRef[]
): boolean {
  if (!role.scope) {
    return true
  }

  const roleScope = role.scope
  return scopes.some(
    (scope) => scope.type === roleScope.type && scope.id === roleScope.id
  )
}

/**
 * Returns the roles applicable within `scope`.
 *
 * When `scope` is `undefined` no scope context was provided and ALL roles
 * apply (the scope-union policies). When `scope` is provided — a single scope, several, or an empty
 * set — strict semantics apply: unscoped roles always count, scoped roles only
 * when their scope is in the set.
 */
export function applicableRoles(
  roles: ResolvedRole[],
  scope?: RbacScopeRef | RbacScopeRef[]
): ResolvedRole[] {
  if (scope === undefined) {
    return roles
  }

  const scopes = Array.isArray(scope) ? scope : [scope]
  return roles.filter((role) => roleAppliesToScopes(role, scopes))
}

/**
 * Returns the unique ids of the roles applicable within `scope`. See
 * {@link applicableRoles} for the scope semantics.
 */
export function applicableRoleIds(
  roles: ResolvedRole[],
  scope?: RbacScopeRef | RbacScopeRef[]
): string[] {
  return Array.from(
    new Set(applicableRoles(roles, scope).map((role) => role.role_id))
  )
}
