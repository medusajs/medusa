import { MedusaContainer } from "@medusajs/types"
import { MedusaModule } from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
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
 * The operations granted on each resource. Either side may be `*`.
 */
export type PolicyMap = Map<string, Set<string>>

const RBAC_CACHE_TTL = 60 * 60 * 24

/**
 * Groups policies by resource.
 */
export function toPolicyMap(policies: Iterable<Policy>): PolicyMap {
  const policyMap: PolicyMap = new Map()

  for (const { resource, operation } of policies) {
    const operations = policyMap.get(resource) ?? new Set<string>()
    operations.add(operation)
    policyMap.set(resource, operations)
  }

  return policyMap
}

/**
 * Whether `policies` grant `(resource, operation)`. This is the single source
 * of truth for wildcard semantics: `*` matches as the resource, the operation,
 * or both.
 */
export function isGranted(
  policies: PolicyMap,
  resource: string,
  operation: string
): boolean {
  const operations = new Set([
    ...(policies.get(resource) ?? []),
    ...(policies.get(WILDCARD) ?? []),
  ])

  return operations.has(operation) || operations.has(WILDCARD)
}

/**
 * The entries of `universe` that `policies` grant, as `resource:operation`
 * strings: the policies' wildcards expanded against concrete entries.
 */
export function expandGrants(
  policies: PolicyMap,
  universe: Policy[]
): Set<string> {
  const granted = new Set<string>()

  for (const { resource, operation } of universe) {
    if (isGranted(policies, resource, operation)) {
      granted.add(`${resource}:${operation}`)
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

  const policies = await fetchRolePolicies(roleIds, container)

  for (const action of actionList) {
    const operations = Array.isArray(action.operation)
      ? action.operation
      : [action.operation]

    for (const op of operations) {
      if (!isGranted(policies, action.resource, op)) {
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
    return new Set(
      universe.map(({ resource, operation }) => `${resource}:${operation}`)
    )
  }

  if (!roleIds.length) {
    return new Set()
  }

  const policies = await fetchRolePolicies(roleIds, container)

  return expandGrants(policies, universe)
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

  const policies = await fetchRolePolicies(roleIds, container)
  const permissions: string[] = []

  for (const [resource, operations] of policies) {
    for (const operation of operations) {
      permissions.push(`${resource}:${operation}`)
    }
  }

  return permissions.sort()
}

/**
 * Fetches a single role's policies from cache or database.
 */
async function fetchSingleRolePolicies(
  roleId: string,
  container: MedusaContainer
): Promise<Policy[]> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // Cleared by the caching module on the RBAC module's mutation events.
  const tags: string[] = [
    RBAC_CACHE_TAGS.role(roleId),
    RBAC_CACHE_TAGS.ROLE_POLICY_LIST,
  ]

  return await useCache<Policy[]>(
    async () => {
      const { data: roles } = await query.graph({
        entity: "rbac_role",
        fields: ["id", "policies.*"],
        filters: { id: roleId },
      })

      const policies: Policy[] = []

      for (const policy of roles[0]?.policies ?? []) {
        policies.push({
          resource: policy.resource,
          operation: policy.operation,
        })
        tags.push(RBAC_CACHE_TAGS.policy(policy.id))
      }

      return policies
    },
    {
      container,
      key: roleId,
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
 * The policies of all the given roles, merged, from individually cached role
 * queries.
 */
async function fetchRolePolicies(
  roleIds: string[],
  container: MedusaContainer
): Promise<PolicyMap> {
  const rolePolicies = await Promise.all(
    roleIds.map((roleId) => fetchSingleRolePolicies(roleId, container))
  )

  return toPolicyMap(rolePolicies.flat())
}
