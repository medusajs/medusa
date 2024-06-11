import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"
import { HttpTypes } from "@medusajs/types"

export function maybeApplyPriceListsFilter() {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    const filterableFields: HttpTypes.AdminProductParams = req.filterableFields

    if (!filterableFields.price_list_id) {
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
