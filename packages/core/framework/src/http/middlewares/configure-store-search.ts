import { SearchTypes } from "@medusajs/types"
import { NextFunction, RequestHandler } from "express"
import { MedusaRequest, MedusaResponse, MedusaStoreRequest } from "../types"

/**
 * Called once per request, so a store's constraints can depend on who is asking
 * rather than being fixed at boot.
 */
export type StoreSearchFilterResolver = (
  req: MedusaStoreRequest
) => SearchTypes.SearchFilters | Promise<SearchTypes.SearchFilters>

export type StoreSearchIndexConfig = {
  /**
   * Filters ANDed onto every query for this index, so a storefront can narrow
   * its own results but never widen past them.
   */
  filters?: StoreSearchFilterResolver
}

export type StoreSearchConfig = {
  /**
   * The indexes `POST /store/search` may query. Only allow indexes that
   * should be accessible publicly, such as products.
   */
  allowed_indexes: Record<string, boolean | StoreSearchIndexConfig>
}

/**
 * Intersected into the one route that reads it rather than carried by every
 * `MedusaRequest`.
 */
export type ConfiguredStoreSearch = {
  storeSearchConfig?: StoreSearchConfig
}

/**
 * Creates a middleware that configures `POST /store/search`.
 *
 * Used to control index access and filtering.
 *
 * A product index is narrowed to published products for the sales channel by default,
 * whenever status and sales_channel_ids are defined on the product index.
 * Additional filtering can be done through the `filters` option.
 *
 * @param config - The indexes to expose and the constraints to apply to them.
 *
 * @example
 * import { configureStoreSearch, defineMiddlewares } from "@medusajs/framework/http"
 *
 * export default defineMiddlewares({
 *   routes: [
 *     {
 *       matcher: "/store/search",
 *       middlewares: [
 *         configureStoreSearch({
 *           allowed_indexes: {
 *             product: true,
 *             product_category: { filters: () => ({ is_active: true }) },
 *           },
 *         }),
 *       ],
 *     },
 *   ],
 * })
 */
export const configureStoreSearch = (
  config: StoreSearchConfig
): RequestHandler => {
  return ((
    req: MedusaRequest & ConfiguredStoreSearch,
    _res: MedusaResponse,
    next: NextFunction
  ): void => {
    req.storeSearchConfig = {
      allowed_indexes: {
        ...(req.storeSearchConfig?.allowed_indexes ?? {}),
        ...config.allowed_indexes,
      },
    }

    next()
  }) as unknown as RequestHandler
}
