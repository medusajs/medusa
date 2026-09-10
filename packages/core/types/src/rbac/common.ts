import { BaseFilterable } from "../dal"

export type RbacRoleDTO = {
  id: string
  name: string
  description?: string | null
  metadata?: Record<string, unknown> | null
  policies?: RbacPolicyDTO[]
  deleted_at?: Date | string | null
}

export type FilterableRbacRoleProps = {
  id?: string | string[]
  name?: string
  q?: string
}

export type RbacPolicyDTO = {
  id: string
  key: string
  resource: string
  operation: string
  name?: string | null
  description?: string | null
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export type FilterableRbacPolicyProps = {
  id?: string | string[]
  key?: string | string[]
  resource?: PolicyResourceValue | PolicyResourceValue[]
  operation?: PolicyOperationValue | PolicyOperationValue[]
  q?: string
}

export type RbacRolePolicyDTO = {
  id: string
  role_id: string
  policy_id: string
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export type FilterableRbacRolePolicyProps = {
  id?: string | string[]
  role_id?: string | string[]
  policy_id?: string | string[]
}

export type RbacRoleParentDTO = {
  id: string
  role_id: string
  parent_id: string
  metadata?: Record<string, unknown> | null
}

export type FilterableRbacRoleParentProps = {
  id?: string | string[]
  role_id?: string | string[]
  parent_id?: string | string[]
}

export type RbacRoleAssignmentDTO = {
  id: string
  role_id: string
  reference: string
  reference_id: string
  scope?: string | null
  scope_id?: string | null
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export interface FilterableRbacRoleAssignmentProps
  extends BaseFilterable<FilterableRbacRoleAssignmentProps> {
  id?: string | string[]
  role_id?: string | string[]
  reference?: string | string[]
  reference_id?: string | string[]
  scope?: string | string[] | null
  scope_id?: string | string[] | null
}

/**
 * A scope a request acts within, identified by the scope
 * entity's type and id (e.g. `{ type: "organization", id: "org_123" }`).
 */
export type RbacScope = {
  type: string
  id: string
}

/**
 * The RBAC context of a request, held on `req.rbac_context`.
 *
 * The scope is set by the application, from a middleware registered ahead of
 * the `authorize` middleware guarding the route. The permissions are set by
 * `authorize` itself, once it has resolved the actor's roles.
 */
export type RbacContext = {
  /**
   * The most granular scope the request acts within. When it is not set, only
   * unscoped role assignments are considered when resolving the actor's roles.
   */
  scope?: RbacScope
  /**
   * The policies guarding the request, recorded by the `authorize` middlewares
   * it went through. Read by the query config middlewares to filter the
   * requested fields.
   */
  policies?: PolicyAction[]
  /**
   * The `resource:operation` permissions granted by the roles resolved for the
   * request. Wildcards are listed as they are stored (e.g. `product:*`).
   */
  permissions?: string[]
}

/**
 * RBAC operations type-only registry.
 *
 * Medusa's own operations are declared here. Applications and plugins that
 * need their own operations augment this interface, which widens
 * {@link PolicyOperationValue} and therefore what a route's `policies` accepts:
 *
 * ```ts
 * // src/types/rbac.d.ts
 * declare module "@medusajs/types" {
 *   interface PolicyOperationRegistry {
 *     approve: "approve"
 *   }
 * }
 *
 * export {}
 * ```
 *
 * ```ts
 * // anywhere policies are declared, now autocompleted alongside the core operations
 * policies: [{ resource: "brand", operation: "approve" }]
 * ```
 *
 * Augment `@medusajs/types`. A single augmentation file then covers route policies,
 * workflows, the module service and the admin dashboard's permission utilities alike.
 */
export interface PolicyOperationRegistry {
  read: "read"
  create: "create"
  update: "update"
  delete: "delete"
}

/**
 * Every operation a route may be guarded by: the ones in
 * {@link PolicyOperationRegistry}, plus the wildcard.
 */
export type PolicyOperationValue =
  | PolicyOperationRegistry[keyof PolicyOperationRegistry]
  | "*"

/**
 * The resources Medusa core governs with RBAC policies. Each resource is
 * expanded into one policy per core operation, and the resulting list is
 * synced to the database on every boot by the RBAC module's `core-policies`
 * loader. It also seeds {@link PolicyResourceRegistry}.
 */
export const CORE_POLICY_RESOURCES = [
  // Customer
  "customer",
  "customer_address",
  "customer_group",

  // Inventory
  "inventory_item",
  "inventory_level",
  "reservation_item",
  "stock_location",

  // Order
  "order",
  "order_item",
  "order_change",
  "order_address",
  "order_claim",
  "order_claim_item",
  "order_exchange",
  "order_credit_line",
  "return",
  "return_reason",

  // Payment
  "payment",
  "payment_collection",
  "payment_method",
  "payment_session",
  "refund",
  "capture",
  "refund_reason",

  // Pricing
  "price_list",
  "price_preference",
  "price",
  "currency",

  // Product
  "product",
  "product_variant",
  "product_option",
  "product_option_value",
  "product_tag",
  "product_type",
  "product_category",
  "product_collection",
  "property_label",

  // Promotion
  "campaign",
  "promotion",

  // Region
  "region",

  // Sales channel
  "sales_channel",

  // Shipping
  "shipping_option",
  "shipping_option_type",
  "shipping_profile",
  "fulfillment",
  "fulfillment_provider",
  "fulfillment_set",
  "service_zone",

  // System
  "file",
  "notification",
  "workflow_execution",
  "store",
  "store_locale",

  // Tax
  "tax_provider",
  "tax_rate",
  "tax_region",

  // Translation
  "translation",
  "translation_setting",

  // User
  "user",
  "api_key",
  "invite",

  // RBAC
  "rbac_role",
  "rbac_policy",
  "rbac_role_assignment",
] as const

type CorePolicyResourceMap = {
  [K in (typeof CORE_POLICY_RESOURCES)[number]]: K
}

/**
 * RBAC resources type-only registry, seeded with {@link CORE_POLICY_RESOURCES}.
 *
 * Applications and plugins that guard their own resources (typically custom
 * models) augment this interface, which widens {@link PolicyResourceValue}
 * and therefore what policies accept — usually in the same file that augments
 * {@link PolicyOperationRegistry}:
 *
 * ```ts
 * // src/types/rbac.d.ts
 * declare module "@medusajs/types" {
 *   interface PolicyResourceRegistry {
 *     brand: "brand"
 *   }
 * }
 *
 * export {}
 * ```
 *
 * See {@link PolicyOperationRegistry} for why the augmentation targets
 * `@medusajs/types`.
 */
export interface PolicyResourceRegistry extends CorePolicyResourceMap {}

/**
 * Every resource a policy may govern: the ones in
 * {@link PolicyResourceRegistry}, plus the wildcard.
 */
export type PolicyResourceValue =
  | PolicyResourceRegistry[keyof PolicyResourceRegistry]
  | "*"

/**
 * A `(resource, operation)` pair a route may be guarded by.
 *
 * Both slots are constrained to their registries
 * ({@link PolicyResourceRegistry}, {@link PolicyOperationRegistry}), so
 * applications that augment them can guard routes with their own resources
 * and operations while typos stay compile errors.
 */
export type PolicyAction = {
  resource: PolicyResourceValue
  operation: PolicyOperationValue | PolicyOperationValue[]
}

export type RbacScopeConfig = {
  /**
   * The scope type, e.g. "organization", "product", "user", etc.
   * This is used to identify the scope in the role assignments table.
   */
  type: string
  /**
   * The path from the actor to the scope entity. For example,
   * "organizations.projects" for a project type scope.
   */
  path: string
  /**
   * The field that is used to identify the scope. Defaults to "id".
   */
  id_field?: string
  /**
   * The display field of the underlying scope entity. This is useful
   * to build UIs that can get the possible scope values for a scoped
   * role assignment. For example, "name" for a project type scope.
   */
  display_field?: string
}

export type AuthzContextConfig = {
  /**x
   * Entities that can hold role assignments reachable from the actor in the graph. Used
   * to build the AuthzContext necessary to resolve the actor's roles.
   */
  grantees: {
    /**
     * The entity that can hold role assignments reachable from the actor.
     */
    entity: string
    /**
     * The path from the actor to the entity's id.
     */
    path: string
    /**
     * The scope configurations for the grantee.
     */
    scope_configs?: RbacScopeConfig[]
  }[]
}
