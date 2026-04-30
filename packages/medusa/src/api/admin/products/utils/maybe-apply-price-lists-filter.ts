import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "@medusajs/framework/http"

/**
 * Creates a middleware that applies price list filtering to product queries.
 * When a `price_list_id` filter is provided, this middleware converts it to variant-based
 * filtering by querying prices directly to extract variant IDs associated with the price list.
 * This optimization avoids hydrating all prices on large price lists, which can be a
 * significant performance overhead.
 * 
 * @returns A middleware function that processes price list filters
 */
export function maybeApplyPriceListsFilter() {
  return async function applyPriceListsFilter(
    req: MedusaRequest,
    _,
    next: NextFunction
  ) {
    const filterableFields: HttpTypes.AdminProductListParams =
      req.filterableFields

    if (!filterableFields.price_list_id) {
      return next()
    }

    const priceListIds = filterableFields.price_list_id
    delete filterableFields.price_list_id

    // Query the `price` entry point directly with a `price_list_id` filter
    // instead of `price_list` with a wide `prices.price_set.variant.id`
    // expansion. The latter forces the remote joiner to hydrate every price
    // and price-set on the price list before we can extract variant ids — a
    // significant overhead on large price lists (thousands of prices).
    const queryObject = remoteQueryObjectFromString({
      entryPoint: "price",
      fields: ["price_set.variant.id"],
      variables: {
        filters: { price_list_id: priceListIds },
      },
    })

    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const prices = await remoteQuery(queryObject)
    const variantIds = new Set<string>()

    for (const price of prices) {
      const variantId = price.price_set?.variant?.id
      if (variantId) {
        variantIds.add(variantId)
      }
    }

    filterableFields.variants = {
      ...(filterableFields.variants ?? {}),
      id: Array.from(variantIds),
    }

    return next()
  }
}
