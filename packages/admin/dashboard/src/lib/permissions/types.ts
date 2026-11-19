/**
 * Permission types for RBAC in the admin dashboard.
 *
 * Permissions follow the pattern: `{resource}:{operation}`
 * Examples:
 *   - customer:read - Can view customers
 *   - customer:create - Can create customers
 *   - customer:* - Wildcard, full access (read + create + update + delete)
 */
import { PolicyOperationValue, PolicyResourceValue } from "@medusajs/types"

/**
 * Resources that can have permissions applied to them.
 */
export type PermissionResource = PolicyResourceValue

/**
 * Operations that can be performed on resources.
 */
export type PermissionOperation = PolicyOperationValue

/**
 * A single permission string in the format "resource:operation"
 */
export type Permission = `${PermissionResource}:${PermissionOperation}`

/**
 * A destination a user can be routed to, gated by a single permission.
 */
export type LandingRoute = {
  to: string
  permission: Permission
}

/**
 * How role checks match against the actor's roles.
 *
 * - `covers` (default): passes when the actor's effective permissions include
 *   everything the role grants, regardless of assignment. A super admin
 *   covers every role.
 * - `assigned`: passes only when the role is literally assigned to the actor.
 */
export type RoleMatch = "covers" | "assigned"

/**
 * A role assigned to the actor.
 */
export interface ActorRole {
  /**
   * The role's ID.
   */
  id: string
  /**
   * The role's unique name. Role checks match on this value.
   */
  name: string
}

/**
 * A policy represents the actor's set of permissions.
 */
export interface ActorPolicy {
  /**
   * Array of permission strings the actor has been granted.
   */
  permissions: Permission[]
  /**
   * The actor's assigned roles.
   */
  roles?: ActorRole[]
  /**
   * Names of the roles the actor covers: roles whose grants are a subset of
   * the actor's effective permissions. Assigned roles are always covered.
   */
  covered_roles?: string[]
}

/**
 * Required permissions descriptor for a subtree or component.
 */
export interface PermissionRequirement {
  /**
   * Permissions required for the subtree/component.
   */
  permissions: Permission[]
  /**
   * If true, requires ALL permissions. Default is ANY.
   */
  requireAll?: boolean
  /**
   * Optional source label for debugging or display.
   */
  source?: string
}

/**
 * Props for permission-related context and hooks.
 */
export interface PermissionsContextValue {
  /**
   * The actor's current policy containing their permissions.
   */
  policy: ActorPolicy | null
  /**
   * Whether the policy is currently being loaded.
   */
  isLoading: boolean
  /**
   * Check if the actor has a specific permission.
   */
  hasPermission: (permission: Permission) => boolean
  /**
   * Check if the actor has any of the specified permissions.
   */
  hasAnyPermission: (permissions: Permission[]) => boolean
  /**
   * Check if the actor has all of the specified permissions.
   */
  hasAllPermissions: (permissions: Permission[]) => boolean
  /**
   * Check if actor can perform an operation on a resource.
   */
  can: (resource: PermissionResource, operation: PermissionOperation) => boolean
  /**
   * The actor's assigned roles.
   */
  roles: ActorRole[]
  /**
   * Check if the actor holds a role, matched by role name.
   * Defaults to coverage matching; pass `"assigned"` for identity matching.
   */
  hasRole: (role: string, match?: RoleMatch) => boolean
  /**
   * Check if the actor holds any of the specified roles, matched by role name.
   * Defaults to coverage matching; pass `"assigned"` for identity matching.
   */
  hasAnyRole: (roles: string[], match?: RoleMatch) => boolean
  /**
   * Check if the actor holds all of the specified roles, matched by role name.
   * Defaults to coverage matching; pass `"assigned"` for identity matching.
   */
  hasAllRoles: (roles: string[], match?: RoleMatch) => boolean
}

/**
 * Context value for required permissions collection.
 */
export interface PermissionsRequirementsContextValue {
  /**
   * Collected permission requirements for the current subtree.
   */
  requiredPermissions: PermissionRequirement[]
  /**
   * Register required permissions for the current subtree.
   */
  registerRequiredPermissions: (
    id: string,
    requirement: PermissionRequirement
  ) => void
  /**
   * Unregister required permissions for the current subtree.
   */
  unregisterRequiredPermissions: (id: string) => void
}
