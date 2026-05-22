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
