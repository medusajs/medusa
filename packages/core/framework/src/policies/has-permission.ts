import { MedusaContainer } from "@medusajs/types"
import { MedusaModule } from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
  permissionKey,
  RBAC_CACHE_TAGS,
  useCache,
  WILDCARD,
} from "@medusajs/utils"

export type PermissionAction = {
  resource: string
  operation: string | string[]
}

/*
/**
 *
 * @property roles the role(s) to check. Can be a single string or an array of strings.
 * @property actions the action(s) to check. Can be a single `PermissionAction` or an array of `PermissionAction`s.
 * @property container the Medusa container
*/
export type HasPermissionInput = {
  roles: string | string[]
  actions: PermissionAction | PermissionAction[]
  container: MedusaContainer
}

export type ResolvePermissionsInput = {
  roles: string | string[]
  /**
   * The universe of `(resource, operation)` tuples to evaluate against the
   * actor's policies. The result is the subset of this universe that the
   * actor is granted, with wildcards (`*:*`, `*:op`, `resource:*`) expanded.
   */
  universe: { resource: string; operation: string }[]
  container: MedusaContainer
}

export type ListRolePermissionsInput = {
  roles: string | string[]
  container: MedusaContainer
}

type Policy = { resource: string; operation: string }

/**
 * The permissions a set of policies grants, as `resource:operation` keys.
 * Wildcards are kept as stored (e.g. `product:*`, `*:read`, `*:*`).
 */
export type PermissionSet = Set<string>

export const RBAC_CACHE_TTL = 60

/**
 * Keys the policies by `resource:operation`.
 */
export function toPermissionSet(policies: Iterable<Policy>): PermissionSet {
  const permissions: PermissionSet = new Set()

  for (const { resource, operation } of policies) {
    permissions.add(permissionKey(resource, operation))
  }

  return permissions
}

/**
 * Whether `permissions` grant `(resource, operation)`. This is the single
 * source of truth for wildcard semantics: `*` matches as the resource, the
 * operation, or both.
 */
export function isGranted(
  permissions: PermissionSet,
  resource: string,
  operation: string
): boolean {
  return (
    permissions.has(permissionKey(resource, operation)) ||
    permissions.has(permissionKey(resource, WILDCARD)) ||
    permissions.has(permissionKey(WILDCARD, operation)) ||
    permissions.has(permissionKey(WILDCARD, WILDCARD))
  )
}

/**
 * The keys of the `candidates` that `permissions` grant, with the permissions'
 * wildcards matched against each concrete candidate.
 */
export function grantedKeys(
  permissions: PermissionSet,
  candidates: Policy[]
): Set<string> {
  const granted = new Set<string>()

  for (const { resource, operation } of candidates) {
    if (isGranted(permissions, resource, operation)) {
      granted.add(permissionKey(resource, operation))
    }
  }

  return granted
}

/**
 * Checks if the given role(s) have permission to perform the specified action(s).
 *
 * @param input - The input containing roles, actions, and container
 * @returns true if all actions are permitted, false otherwise
 *
 * @example
 * ```ts
 * const canWrite = await hasPermission({
 *   roles: ['role_123'],
 *   actions: { resource: 'product', operation: 'write' },
 *   container
 * })
 *
 * const canDeleteAndWrite = await hasPermission({
 *   roles: ['role_123'],
 *   actions: { resource: 'product', operation: ['delete', 'write'] },
 *   container
 * })
 * ```
 */
export async function hasPermission(
  input: HasPermissionInput
): Promise<boolean> {
  const { roles, actions, container } = input

  const roleIds = Array.isArray(roles) ? roles : [roles]
  const actionList = Array.isArray(actions) ? actions : [actions]
  const isDisabled = !MedusaModule.isInstalled(Modules.RBAC)
  if (isDisabled || !actionList?.length) {
    return true
  }

  if (!roleIds?.length) {
    return false
  }

  const permissions = await fetchRolePermissions(roleIds, container)

  for (const action of actionList) {
    const operations = Array.isArray(action.operation)
      ? action.operation
      : [action.operation]

    for (const op of operations) {
      if (!isGranted(permissions, action.resource, op)) {
        return false
      }
    }
  }

  return true
}

/**
 * Resolves the actor's effective permission set: the subset of `universe` that
 * the actor is granted, with wildcards expanded against concrete entries.
 *
 * This is the "inverse" of {@link hasPermission}. It is intended for use by
 * endpoints that need to hand the client a flat permission list (so the client
 * can do literal lookups instead of duplicating wildcard semantics).
 *
 * @example
 * ```ts
 * const granted = await resolvePermissions({
 *   roles: ["role_super_admin"],
 *   universe: [
 *     { resource: "product", operation: "read" },
 *     { resource: "customer", operation: "create" },
 *   ],
 *   container,
 * })
 * // granted = Set { "product:read", "customer:create" }
 * ```
 */
export async function resolvePermissions(
  input: ResolvePermissionsInput
): Promise<Set<string>> {
  const { roles, universe, container } = input

  const roleIds = Array.isArray(roles) ? roles : [roles]
  if (!MedusaModule.isInstalled(Modules.RBAC)) {
    return toPermissionSet(universe)
  }

  if (!roleIds.length) {
    return new Set()
  }

  const permissions = await fetchRolePermissions(roleIds, container)

  return grantedKeys(permissions, universe)
}

/**
 * Lists the permissions the given roles grant, as `resource:operation` strings.
 *
 * Wildcards are listed as they are stored (e.g. `product:*`, `*:*`), because
 * expanding them requires the universe of persisted policies. Use
 * {@link resolvePermissions} when the expanded set is needed.
 *
 * @example
 * ```ts
 * const permissions = await listRolePermissions({
 *   roles: ["role_123"],
 *   container,
 * })
 * // permissions = ["product:delete", "product:read"]
 * ```
 */
export async function listRolePermissions(
  input: ListRolePermissionsInput
): Promise<string[]> {
  const { roles, container } = input

  const roleIds = Array.isArray(roles) ? roles : [roles]

  if (!roleIds.length) {
    return []
  }

  const permissions = await fetchRolePermissions(roleIds, container)

  return [...permissions].sort()
}

/**
 * Fetches the policies of a set of roles from cache or database.
 */
async function fetchRolesPolicies(
  roleIds: string[],
  container: MedusaContainer
): Promise<Policy[]> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const sortedRoleIds = [...new Set(roleIds)].sort()

  // Cleared by the caching module on the RBAC module's mutation events. The
  // policy tags are added as the policies are read, before the entry is set.
  const tags: string[] = [
    ...sortedRoleIds.map((roleId) => RBAC_CACHE_TAGS.role(roleId)),
    RBAC_CACHE_TAGS.ROLE_POLICY_LIST,
  ]

  return await useCache<Policy[]>(
    async () => {
      const { data: roles } = await query.graph({
        entity: "rbac_role",
        fields: ["id", "policies.*"],
        filters: { id: sortedRoleIds },
      })

      const policies: Policy[] = []

      for (const role of roles ?? []) {
        for (const policy of role.policies ?? []) {
          policies.push({
            resource: policy.resource,
            operation: policy.operation,
          })
          tags.push(RBAC_CACHE_TAGS.policy(policy.id))
        }
      }

      return policies
    },
    {
      container,
      key: `rbac-role-permissions:${sortedRoleIds.join(",")}`,
      tags,
      enable: true,
      ttl: RBAC_CACHE_TTL,
    }
  )
}

/**
 * Fetches the set of governed resources: every distinct `rbac_policy.resource`
 * from cache or database.
 */
export async function fetchPolicyResources(
  container: MedusaContainer
): Promise<Set<string>> {
  if (!MedusaModule.isInstalled(Modules.RBAC)) {
    return new Set()
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const resources = await useCache<string[]>(
    async () => {
      const { data: policies } = await query.graph({
        entity: "rbac_policy",
        fields: ["resource"],
      })

      return deduplicate(
        (policies ?? []).map((policy) => policy.resource as string)
      )
    },
    {
      container,
      key: "rbac-policy-resources",
      tags: [RBAC_CACHE_TAGS.POLICY_LIST],
      enable: true,
      ttl: RBAC_CACHE_TTL,
    }
  )

  return new Set(resources)
}

/**
 * The permissions of all the given roles, merged.
 */
async function fetchRolePermissions(
  roleIds: string[],
  container: MedusaContainer
): Promise<PermissionSet> {
  return toPermissionSet(await fetchRolesPolicies(roleIds, container))
}
