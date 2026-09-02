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
 * Field path segments that must never be resolvable on public (unauthenticated)
 * Store API endpoints. Passed as the `disallowed` option of a route's
 * query-config, any requested field whose path contains one of these segments
 * is stripped before the query reaches the remote query engine.
 *
 * These segments are the module-link relations (and their sub-relations) that
 * traverse from public entities (region, product, ...) into order, customer,
 * cart, and payment data. Blocking the top-level segment is sufficient to cut
 * the entire subtree, e.g. blocking `orders` also blocks
 * `orders.customer.email`.
 *
 * without this, an anonymous caller holding only the
 * public publishable key could expand e.g.
 * `GET /store/regions?fields=orders.customer.email` and read every customer's
 * PII, purchase history, and payment metadata.
 */
export const disallowedStoreFields = [
  "orders",
  "carts",
  "order_items",
  "cart_items",
  "customer",
  "payment_collection",
  "payment_collections",
  "account_holder",
  "account_holders",
  "groups",
  "customers",
  // Link entities resolve the same data as the segments above, but under a different
  // name (e.g. `order_link.order`), which would otherwise bypass this list entirely.
  /_link$/,
  "fulfillments",
  "delivery_address",
  ...internalOperationsFields,
]

/**
 * Narrower disallow list for public endpoints that legitimately expose the
 * caller's own `customer`/address/payment data on the primary entity (e.g. the
 * cart retrieved by id during checkout), but must still not be usable to pivot
 * into other resources' order or cart data (e.g. `region.orders`,
 * `customer.orders`).
 */
export const disallowedStorePivotFields = [
  "orders",
  "carts",
  "customers",
  /_link$/,
  ...internalOperationsFields,
]

export const disallowedStoreCustomerFields = [
  /\.orders(?:\.|$)/,
  "carts",
  "groups",
  "customers",
  "order_items",
  "cart_items",
  /_link$/,
  ...internalOperationsFields,
]
