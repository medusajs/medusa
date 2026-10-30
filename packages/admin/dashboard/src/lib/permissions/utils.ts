import { OPERATION_IMPLICATIONS } from "./constants"
import type {
  Permission,
  PermissionOperation,
  PermissionResource,
} from "./types"

/**
 * Parse a permission string into its resource and operation components.
 *
 * @param permission - Permission string in format "resource:operation"
 * @returns Object with resource and operation, or null if invalid
 */
export function parsePermission(permission: string): {
  resource: PermissionResource
  operation: PermissionOperation
} | null {
  const parts = permission.split(":")
  if (parts.length !== 2) {
    return null
  }

  const [resource, operation] = parts

  return {
    resource: resource as PermissionResource,
    operation: operation as PermissionOperation,
  }
}

/**
 * Build a permission string from resource and operation.
 *
 * @param resource - The permission resource
 * @param operation - The permission operation
 * @returns Permission string
 */
export function buildPermission(
  resource: PermissionResource,
  operation: PermissionOperation
): Permission {
  return `${resource}:${operation}` as Permission
}

/**
 * Build a lookup of all permissions granted by the given permission strings,
 * expanding each operation to the operations it implies (e.g. a `*` grant
 * implies read/create/update/delete).
 *
 * @param granted - The raw permission strings granted to the user
 * @returns A record keyed by the implied permission strings
 */
export function buildPermissionLookup(
  granted: string[]
): Record<Permission, true> {
  const lookup: Record<Permission, true> = Object.create(null)

  for (const permission of granted) {
    const parsed = parsePermission(permission)
    if (!parsed) {
      continue
    }

    const { resource, operation } = parsed
    const impliedOperations = OPERATION_IMPLICATIONS[operation] || [operation]

    for (const impliedOperation of impliedOperations) {
      lookup[buildPermission(resource, impliedOperation)] = true
    }
  }

  return lookup
}

/**
 * Check whether the granted permissions satisfy the required ones.
 *
 * @param granted - The raw permission strings granted to the user
 * @param required - The permissions required to pass the check
 * @param requireAll - When true (default), all required permissions must be
 *   held. When false, holding any one is enough.
 * @returns Whether the requirement is satisfied
 */
export function checkPermissions(
  granted: string[],
  required: Permission[],
  requireAll: boolean = true
): boolean {
  if (!required.length) {
    return true
  }

  const lookup = buildPermissionLookup(granted)

  return requireAll
    ? required.every((permission) => !!lookup[permission])
    : required.some((permission) => !!lookup[permission])
}
