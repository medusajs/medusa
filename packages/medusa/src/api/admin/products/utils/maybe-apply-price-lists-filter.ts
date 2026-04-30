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
    const filterableFields: HttpTypes.AdminProductListParams =
      req.filterableFields

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
      !filterableFields.tag_id &&
      !filterableFields.category_id
    ) {
      return next()
    }

    const priceListIds = filterableFields.price_list_id
    delete filterableFields.price_list_id

    const queryObject = remoteQueryObjectFromString({
      entryPoint: "price_list",
      fields: ["prices.price_set.variant.id"],
      variables: {
        id: priceListIds,
      },
    })

    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const variantIds: string[] = []
    const priceLists = await remoteQuery(queryObject)

    priceLists.forEach((priceList) => {
      priceList.prices?.forEach((price) => {
        const variantId = price.price_set?.variant?.id

        if (variantId) {
          variantIds.push(variantId)
        }
      })
    })

    filterableFields.variants = {
      ...(filterableFields.variants ?? {}),
      id: variantIds,
    }

    return next()
  }
}
