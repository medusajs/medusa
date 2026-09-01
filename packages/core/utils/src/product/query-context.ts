/**
 * Query context namespace for the Product module.
 *
 * Contexts are namespaced by what they configure, so several can travel on the
 * same query without colliding:
 *
 * ```ts
 * QueryContext({
 *   [ProductsQueryContextKey]: { [PublishedProductsContextKey]: true },
 * })
 * ```
 */
export const ProductsQueryContextKey = "products"

/**
 * Asks the Product module to resolve published products only.
 *
 * Set by the store API, so that traversing into `Product` from a product tag,
 * type, collection, or category hides unpublished products the same way a
 * direct product query does.
 */
export const PublishedProductsContextKey = "published"
