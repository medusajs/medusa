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
]

/**
 * Narrower disallow list for public endpoints that legitimately expose the
 * caller's own `customer`/address/payment data on the primary entity (e.g. the
 * cart retrieved by id during checkout), but must still not be usable to pivot
 * into other resources' order or cart data (e.g. `region.orders`,
 * `customer.orders`).
 */
export const disallowedStorePivotFields = ["orders", "carts"]
