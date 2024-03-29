import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"
import { AdminGetProductsParams } from "../validators"

export function maybeApplySalesChannelsFilter() {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    const filterableFields: AdminGetProductsParams = req.filterableFields

    if (!filterableFields.sales_channel_id) {
      return next()
    }

    const salesChannelIds = filterableFields.sales_channel_id
    delete filterableFields.sales_channel_id

    const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const queryObject = remoteQueryObjectFromString({
      entryPoint: "product_sales_channel",
      fields: ["product_id"],
      variables: { sales_channel_id: salesChannelIds },
    })

    const productsInSalesChannels = await remoteQuery(queryObject)

    filterableFields.id = productsInSalesChannels.map((p) => p.product_id)

    return next()
  }
}
