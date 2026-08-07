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
 *
 * The listed values map to Medusa's built-in commerce domains and drive editor
 * autocomplete. Custom resources (e.g. from an application's own models) are
 * also accepted via the trailing `string` member, so consuming projects can
 * check permissions for their own `resource:operation` policies.
 */
export type PermissionResource =
  | "customer"
  | "customer_group"
  | "customer_address"
  | "order"
  | "order_address"
  // Order sub-operation resources (the backend protects order actions with
  // these; the order detail wires them as `[<resource>:<op>, order:update]`).
  | "fulfillment"
  | "return"
  | "order_claim"
  | "order_exchange"
  | "order_change"
  | "capture"
  | "payment"
  | "refund"
  | "payment_collection"
  | "order_credit_line"
  | "reservation_item"
  | "product"
  | "product_category"
  | "product_collection"
  | "product_tag"
  | "product_type"
  | "product_variant"
  | "product_option"
  | "price"
  | "price_preference"
  | "currency"
  | "inventory"
  | "inventory_item"
  | "inventory_level"
  | "reservation"
  | "promotion"
  | "campaign"
  | "price_list"
  | "region"
  | "store"
  | "user"
  | "invite"
  | "rbac_role"
  | "rbac_policy"
  | "sales_channel"
  | "stock_location"
  | "shipping_profile"
  | "shipping_option"
  | "shipping_option_type"
  | "service_zone"
  | "fulfillment_set"
  | "fulfillment_provider"
  | "tax_region"
  | "tax_rate"
  | "api_key"
  | "return_reason"
  | "refund_reason"
  | "workflow_execution"
  | "translation"
  | "translation_setting"
  | "notification"
  | "file"
  | "store_locale"
  | "property_label"
  // Allow custom resources from consuming projects' customizations while
  // preserving autocomplete for the built-in resources above.
  | (string & {})

/**
 * Operations that can be performed on resources.
 */
export type PermissionOperation = "read" | "create" | "update" | "delete" | "*"

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
   */
  hasRole: (role: string) => boolean
  /**
   * Check if the actor holds any of the specified roles, matched by role name.
   */
  hasAnyRole: (roles: string[]) => boolean
  /**
   * Check if the actor holds all of the specified roles, matched by role name.
   */
  hasAllRoles: (roles: string[]) => boolean
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
