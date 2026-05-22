/**
 * Resources that can have permissions applied to them.
 *
 * These map to Medusa's commerce domains. Plugin authors are not limited to
 * this set — the `Permission` type below uses a `LiteralUnion` pattern so
 * custom resources (e.g. `"widget"` for a plugin) type-check while still
 * surfacing autocomplete for core resources.
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
 * Operations that can be performed on a resource.
 */
export type PermissionOperation =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "*"

/**
 * A single permission in `resource:operation` format.
 *
 * Editor autocomplete suggests known core combinations
 * (e.g. `"customer:read"`). Plugin authors can also pass arbitrary strings
 * for resources registered at runtime (e.g. `"widget:read"`).
 */
export type Permission =
  | `${PermissionResource}:${PermissionOperation}`
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {})

/**
 * Access requirement bag for routes and widgets.
 *
 * Co-locate with the extension config so the dashboard can both:
 *   - render an access-denied page (or skip the widget) when the actor
 *     doesn't satisfy the requirement, and
 *   - hide the sidebar nav item / widget without ever invoking the
 *     backend route.
 */
export interface AccessConfig {
  /**
   * Required permissions. Single string or array. Format: `resource:operation`.
   */
  permissions?: Permission | Permission[]
  /**
   * If true (default), the actor must hold ALL listed permissions.
   * If false, holding ANY one is enough.
   */
  requireAll?: boolean
  /**
   * Optional path to redirect to when access is denied. When omitted, the
   * access-denied page is rendered in place.
   *
   * Only honoured for route configs — widgets simply don't render when the
   * requirement isn't satisfied.
   */
  redirectTo?: string
}
