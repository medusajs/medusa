/**
 * Internal operations data that no Store API type declares, and that the store is
 * therefore never meant to resolve. Each of these has a sanctioned store-facing
 * counterpart, or no store counterpart at all:
 *
 * - `stock_locations`: internal warehouses. Admin-only type.
 * - `publishable_api_keys`: other sales channels' key tokens. Admin-only type.
 * - `sales_channels`: `StoreProduct` explicitly omits it from `BaseProduct`.
 * - `price_set`: the raw pricing bucket behind a variant. The store gets
 *   `calculated_price`, which resolves one context-appropriate price.
 * - `campaign`: promotion budgets and limits. `StoreCartPromotion` declares only
 *   `id`, `code`, `is_automatic` and `application_method`.
 *
 * `prices` and `price_rules` are deliberately absent: they are declared on
 * `StoreCartShippingOption`, so they can only be blocked per route, not globally.
 * `inventory`, `inventory_items` and `location_levels` are absent for the same
 * reason: storefronts resolve a variant's stock through them on the product routes.
 */
const internalOperationsFields = [
  "stock_locations",
  "publishable_api_keys",
  "sales_channels",
  "price_set",
  "campaign",
]

/**
 * Field path segments that must never be resolvable on Store API endpoints.
 * Passed as the `disallowed` option of every store route's query-config, any
 * requested field whose path contains one of these segments is stripped before
 * the query reaches the remote query engine.
 *
 * This list is deliberately minimal: what a route exposes is defined by its
 * `allowed` config, which mirrors the route's defaults exactly. What remains
 * here is what no store route may resolve under any name — internal operations
 * data, and the module-link entities that would otherwise resolve a blocked
 * relation under a different segment (e.g. `order_link.order`).
 */
export const disallowedStoreFields = [
  // Link entities resolve data under a different name than the relation itself
  // (e.g. `order_link.order`), which would otherwise bypass a route's `allowed`
  // config through a path it never declares.
  /_link$/,
  ...internalOperationsFields,
]
