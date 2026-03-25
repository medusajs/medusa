import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, useCache } from "@medusajs/utils"
import { FlagRouter } from "../feature-flags/flag-router"

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

type RolePoliciesCache = Map<string, Map<string, Set<string>>>

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
  const ffRouter = container.resolve(
    ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
  ) as FlagRouter

  const isDisabled = !ffRouter.isFeatureEnabled("rbac")
  if (isDisabled || !roleIds?.length || !actionList?.length) {
    return true
  }

  const rolePoliciesMap = await fetchRolePolicies(roleIds, container)

  for (const action of actionList) {
    // Handle multiple operations for a single resource (and)
    const operations = Array.isArray(action.operation)
      ? action.operation
      : [action.operation]

    for (const op of operations) {
      let operationHasAccess = false

      for (const roleId of roleIds) {
        const resourceMap = rolePoliciesMap.get(roleId)
        if (!resourceMap) {
          continue
        }

        const allowedOps = new Set([
          ...(resourceMap.get(action.resource) || []),
          ...(resourceMap.get("*") || []),
        ])
        if (allowedOps && (allowedOps.has(op) || allowedOps.has("*"))) {
          operationHasAccess = true
          break
        }
      }

      if (!operationHasAccess) {
        return false
      }
    }
  }

  return true
}

/**
 * Fetches a single role's policies from cache or database.
 */
async function fetchSingleRolePolicies(
  roleId: string,
  container: MedusaContainer
): Promise<Map<string, Set<string>>> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const tags: string[] = []
  return await useCache<Map<string, Set<string>>>(
    async () => {
      const { data: roles } = await query.graph({
        entity: "rbac_role",
        fields: ["id", "policies.*"],
        filters: { id: roleId },
      })

      const role = roles[0]
      const resourceMap = new Map<string, Set<string>>()

      tags.push(`rbac_role:${roleId}`)
      if (role?.policies && Array.isArray(role.policies)) {
        const policyIds: string[] = []

        for (const policy of role.policies) {
          policyIds.push(policy.id)

          if (!resourceMap.has(policy.resource)) {
            resourceMap.set(policy.resource, new Set())
          }
          resourceMap.get(policy.resource)!.add(policy.operation)

          tags.push(`rbac_policy:${policy.id}`)
        }
      }

      return resourceMap
    },
    {
      container,
      key: roleId,
      tags,
      ttl: 60 * 60 * 24 * 7,
      providers: ["cache-memory"],
    }
  )
}

/**
 * Fetches policies for multiple roles by composing individually cached role queries.
 */
async function fetchRolePolicies(
  roleIds: string[],
  container: MedusaContainer
): Promise<RolePoliciesCache> {
  const rolePoliciesMap: RolePoliciesCache = new Map()

  await Promise.all(
    roleIds.map(async (roleId) => {
      const resourceMap = await fetchSingleRolePolicies(roleId, container)
      rolePoliciesMap.set(roleId, resourceMap)
    })
  )

  return rolePoliciesMap
}
