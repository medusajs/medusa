import {
  ProductsQueryContextKey,
  PublishedProductsContextKey,
  QueryContext,
} from "@medusajs/framework/utils"

/**
 * Query context that asks the Product module to resolve published products
 * only.
 *
 * `/store/products` filters on `status` as route middleware, but a relation
 * cannot be filtered from the parent's `where`, so store endpoints that expose
 * `Product` as a relation - product tags, product types, collections,
 * categories - have to ask for the constraint themselves. Any new store route
 * that resolves products through another entity has to pass this too.
 */
export const publishedProductsContext = () =>
  QueryContext({
    [ProductsQueryContextKey]: { [PublishedProductsContextKey]: true },
  })
