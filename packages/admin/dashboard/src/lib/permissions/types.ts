/**
 * Permission types for RBAC in the admin dashboard.
 *
 * Permissions follow the pattern: `{resource}:{operation}`
 * Examples:
 *   - customer:read - Can view customers
 *   - customer:create - Can create customers
 *   - customer:* - Wildcard, full access (read + create + update + delete)
 */

/**
 * Resources that can have permissions applied to them.
 * These map to Medusa commerce domains.
 */
export type PermissionResource =
  | "customer"
  | "customer_group"
  | "order"
  | "product"
  | "product_category"
  | "product_collection"
  | "product_tag"
  | "product_type"
  | "inventory"
  | "reservation"
  | "promotion"
  | "campaign"
  | "price_list"
  | "region"
  | "store"
  | "user"
  | "sales_channel"
  | "stock_location"
  | "shipping_profile"
  | "shipping_option"
  | "tax_region"
  | "api_key"
  | "return_reason"
  | "refund_reason"
  | "workflow"
  | "translation"

/**
 * Operations that can be performed on resources.
 */
export type PermissionOperation = "read" | "create" | "update" | "delete" | "*"

/**
 * A single permission string in the format "resource:operation"
 */
export type Permission = `${PermissionResource}:${PermissionOperation}`

/**
 * A policy represents the user's set of permissions.
 */
export interface UserPolicy {
  /**
   * Array of permission strings the user has been granted.
   */
  permissions: Permission[]
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
   * The user's current policy containing their permissions.
   */
  policy: UserPolicy | null
  /**
   * Whether the policy is currently being loaded.
   */
  isLoading: boolean
  /**
   * Check if the user has a specific permission.
   */
  hasPermission: (permission: Permission) => boolean
  /**
   * Check if the user has any of the specified permissions.
   */
  hasAnyPermission: (permissions: Permission[]) => boolean
  /**
   * Check if the user has all of the specified permissions.
   */
  hasAllPermissions: (permissions: Permission[]) => boolean
  /**
   * Check if user can perform an operation on a resource.
   */
  can: (resource: PermissionResource, operation: PermissionOperation) => boolean
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

