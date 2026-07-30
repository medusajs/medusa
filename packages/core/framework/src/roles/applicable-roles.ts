import type { RbacScope, ResolvedRole } from "@medusajs/types"

/**
 * Whether a resolved role applies within `scopes`: unscoped roles always
 * apply; scoped roles apply only when the scope set contains their scope.
 */
function roleAppliesToScopes(role: ResolvedRole, scopes: RbacScope[]): boolean {
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
  scope?: RbacScope | RbacScope[]
): ResolvedRole[] {
  if (scope === undefined) {
    return roles
  }

  const scopes = Array.isArray(scope) ? scope : [scope]
  return roles.filter((role) => roleAppliesToScopes(role, scopes))
}
