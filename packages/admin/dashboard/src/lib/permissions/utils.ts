import type { HttpTypes } from "@medusajs/types"
import { OPERATION_IMPLICATIONS, ROUTE_PERMISSIONS } from "./constants"
import type {
  Permission,
  PermissionOperation,
  PermissionResource,
  UserPolicy,
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
 * Check if an operation is implied by another operation.
 * For example, "*" (wildcard) implies "read", "create", "update", "delete".
 *
 * @param grantedOperation - The operation the user has
 * @param requiredOperation - The operation being checked
 * @returns True if granted operation implies required operation
 */
export function operationImplies(
  grantedOperation: PermissionOperation,
  requiredOperation: PermissionOperation
): boolean {
  const impliedOperations = OPERATION_IMPLICATIONS[grantedOperation] || [
    grantedOperation,
  ]
  return impliedOperations.includes(requiredOperation)
}

/**
 * Check if a user's policy grants a specific permission.
 * Handles wildcards (*) which grant all operations on a resource.
 *
 * @param policy - The user's policy
 * @param permission - The permission to check
 * @returns True if the policy grants the permission
 */
export function checkPermission(
  policy: UserPolicy | null,
  permission: Permission
): boolean {
  if (!policy?.permissions?.length) {
    return false
  }

  const parsed = parsePermission(permission)
  if (!parsed) {
    return false
  }

  const { resource: requiredResource, operation: requiredOperation } = parsed

  for (const granted of policy.permissions) {
    const grantedParsed = parsePermission(granted) // TODO: update with another shape when API is connected
    if (!grantedParsed) {
      continue
    }

    const { resource: grantedResource, operation: grantedOperation } =
      grantedParsed

    // Check if resources match
    if (grantedResource !== requiredResource) {
      continue
    }

    // Check if operation is granted (directly or via implication)
    if (operationImplies(grantedOperation, requiredOperation)) {
      return true
    }
  }

  return false
}

/**
 * Check if a user's policy grants any of the specified permissions.
 *
 * @param policy - The user's policy
 * @param permissions - Array of permissions to check
 * @returns True if any permission is granted
 */
export function checkAnyPermission(
  policy: UserPolicy | null,
  permissions: Permission[]
): boolean {
  if (!permissions?.length) {
    return true
  }

  return permissions.some((permission) => checkPermission(policy, permission))
}

/**
 * Check if a user's policy grants all of the specified permissions.
 *
 * @param policy - The user's policy
 * @param permissions - Array of permissions to check
 * @returns True if all permissions are granted
 */
export function checkAllPermissions(
  policy: UserPolicy | null,
  permissions: Permission[]
): boolean {
  if (!permissions?.length) {
    return true
  }

  return permissions.every((permission) => checkPermission(policy, permission))
}

/**
 * Check if a user can perform an operation on a resource.
 * Convenience function that builds the permission string internally.
 *
 * @param policy - The user's policy
 * @param resource - The resource to check
 * @param operation - The operation to check
 * @returns True if the operation is allowed
 */
export function can(
  policy: UserPolicy | null,
  resource: PermissionResource,
  operation: PermissionOperation
): boolean {
  const permission = buildPermission(resource, operation)
  return checkPermission(policy, permission)
}

/**
 * Match a route path to its route pattern and return required permission.
 * Handles dynamic segments like :id.
 *
 * @param pathname - The current route pathname
 * @returns The required permission or null if no match
 */
export function getRoutePermission(pathname: string): {
  resource: PermissionResource
  operation: PermissionOperation
} | null {
  // First, try exact match
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname]
  }

  // Then, try pattern matching with dynamic segments
  for (const [pattern, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (matchRoutePattern(pathname, pattern)) {
      return permission
    }
  }

  return null
}

/**
 * Match a pathname against a route pattern with dynamic segments.
 *
 * @param pathname - The actual pathname
 * @param pattern - The route pattern (e.g., "/customers/:id")
 * @returns True if the pathname matches the pattern
 */
export function matchRoutePattern(pathname: string, pattern: string): boolean {
  const pathParts = pathname.split("/").filter(Boolean)
  const patternParts = pattern.split("/").filter(Boolean)

  if (pathParts.length !== patternParts.length) {
    return false
  }

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    // Dynamic segment (starts with :)
    if (patternPart.startsWith(":")) {
      continue
    }

    // Static segment must match exactly
    if (patternPart !== pathPart) {
      return false
    }
  }

  return true
}

/**
 * Check if a user can access a specific route based on their policy.
 *
 * @param policy - The user's policy
 * @param pathname - The route pathname to check
 * @returns True if access is allowed
 */
export function canAccessRoute(
  policy: UserPolicy | null,
  pathname: string
): boolean {
  const routePermission = getRoutePermission(pathname)

  // allow access if no permission is defined for this route
  if (!routePermission) {
    return true
  }

  return can(policy, routePermission.resource, routePermission.operation)
}

/**
 * Get all permissions for a resource.
 *
 * @param resource - The resource to get permissions for
 * @returns Array of all possible permissions for the resource
 */
export function getResourcePermissions(
  resource: PermissionResource
): Permission[] {
  const operations: PermissionOperation[] = [
    "read",
    "create",
    "update",
    "delete",
  ]
  return operations.map((operation) => buildPermission(resource, operation))
}

/**
 * Filter an array of items based on permission requirements.
 *
 * @param items - Array of items with optional permission field
 * @param policy - The user's policy
 * @param getPermission - Function to extract permission from item
 * @returns Filtered array of items the user can access
 */
export function filterByPermission<T>(
  items: T[],
  policy: UserPolicy | null,
  getPermission: (item: T) => Permission | Permission[] | undefined
): T[] {
  return items.filter((item) => {
    const permission = getPermission(item)

    if (!permission) {
      return true
    }

    if (Array.isArray(permission)) {
      return checkAnyPermission(policy, permission)
    }

    return checkPermission(policy, permission)
  })
}
