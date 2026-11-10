import type { LandingRoute, PermissionOperation } from "./types"

/**
 * Map of operations to the operations they imply.
 * The wildcard (*) implies all CRUD operations.
 */
export const OPERATION_IMPLICATIONS: Record<
  PermissionOperation,
  PermissionOperation[]
> = {
  read: ["read"],
  create: ["create"],
  update: ["update"],
  delete: ["delete"],
  "*": ["read", "create", "update", "delete", "*"],
}

/**
 * Ordered list of primary destinations a user is routed to after logging in.
 * The first entry the user has read access to wins. Mirrors the order of the
 * main sidebar domains followed by the settings domains.
 */
export const DEFAULT_LANDING_ROUTES: LandingRoute[] = [
  { to: "/orders", permission: "order:read" },
  { to: "/products", permission: "product:read" },
  { to: "/inventory", permission: "inventory_item:read" },
  { to: "/customers", permission: "customer:read" },
  { to: "/promotions", permission: "promotion:read" },
  { to: "/price-lists", permission: "price_list:read" },
  { to: "/settings/store", permission: "store:read" },
  { to: "/settings/users", permission: "user:read" },
  { to: "/settings/roles", permission: "rbac_role:read" },
  { to: "/settings/policies", permission: "rbac_policy:read" },
  { to: "/settings/regions", permission: "region:read" },
  { to: "/settings/tax-regions", permission: "tax_region:read" },
  { to: "/settings/return-reasons", permission: "return_reason:read" },
  { to: "/settings/refund-reasons", permission: "refund_reason:read" },
  { to: "/settings/sales-channels", permission: "sales_channel:read" },
  { to: "/settings/product-types", permission: "product_type:read" },
  { to: "/settings/product-tags", permission: "product_tag:read" },
  { to: "/settings/locations", permission: "stock_location:read" },
  { to: "/settings/publishable-api-keys", permission: "api_key:read" },
  { to: "/settings/workflows", permission: "workflow_execution:read" },
]

/**
 * Route shown to users that have no permissions granted yet.
 */
export const NO_PERMISSIONS_ROUTE = "/no-permissions"
