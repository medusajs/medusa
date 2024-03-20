import {
    ContainerRegistrationKeys,
    remoteQueryObjectFromString,
} from "@medusajs/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"
import { AdminGetProductsParams } from "../validators"

export function maybeApplyPriceListsFilter() {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    const filterableFields: AdminGetProductsParams = req.filterableFields

    if (!filterableFields.price_list_id) {
      return next()
    }

    const priceListIds = filterableFields.price_list_id
    delete filterableFields.price_list_id

    const queryObject = remoteQueryObjectFromString({
      entryPoint: "price_list",
      fields: ["price_set_money_amounts.price_set.variant.id"],
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
      priceList.price_set_money_amounts?.forEach((psma) => {
        const variantId = psma.price_set?.variant?.id
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
