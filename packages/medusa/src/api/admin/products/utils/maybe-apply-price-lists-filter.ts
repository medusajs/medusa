import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "@medusajs/framework/http"
import IndexEngineFeatureFlag from "../../../../feature-flags/index-engine"

export function maybeApplyPriceListsFilter() {
  return async function applyPriceListsFilter(
    req: MedusaRequest,
    _,
    next: NextFunction
  ) {
    const filterableFields: HttpTypes.AdminProductListParams & {
      // these are available through the Zod transformation
      tags?: string | string[]
      categories?: string | string[]
    } = req.filterableFields

    if (!filterableFields.price_list_id) {
      return next()
    }

    // When the index engine is enabled and the route handler will use the
    // index path (i.e. no `tags`/`categories` filters that force a fallback),
    // the handler resolves `price_list_id` natively as
    // `variants.prices.price_list_id` against the index. Skip the in-JS
    // variant id expansion in that case.
    if (
      FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key) &&
      !filterableFields.tags &&
      !filterableFields.categories
    ) {
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
