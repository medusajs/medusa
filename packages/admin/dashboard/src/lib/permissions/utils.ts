import type { HttpTypes } from "@medusajs/types"

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
 * Check if the user can assign a policy.
 *
 * TODO: extend `/admin/rbac/me/permissions` to surface raw wildcard grants
 * (or expose a `canAssign(resource, operation)` check) so wildcard rows can
 * be gated client-side too.
 */
export function canAssignPolicy(
  policy: Pick<HttpTypes.AdminRbacPolicy, "resource" | "operation">,
  hasPermission: (permission: Permission) => boolean
): boolean {
  if (!policy.resource || !policy.operation) {
    return false
  }

  if (policy.resource === "*" || policy.operation === "*") {
    return true
  }

  return hasPermission(
    buildPermission(
      policy.resource as PermissionResource,
      policy.operation as PermissionOperation
    )
  )
}
