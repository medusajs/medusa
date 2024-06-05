import { MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { AuthenticatedMedusaRequest } from "../../../../types/routing"
import { refetchEntity } from "../../refetch-entity"
import { arrayDifference } from "@medusajs/utils"

// Selection of sales channels happens in the following priority:
// - If a publishable API key is passed, we take the sales channels attached to it and filter them down based on the query params
// - If a sales channel id is passed through query params, we use that
// - If not, we use the default sales channel for the store
export function filterByValidSalesChannels() {
  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const publishableApiKey = req.get("x-publishable-api-key")
    const salesChannelIds = req.filterableFields.sales_channel_id as
      | string[]
      | undefined

    if (publishableApiKey) {
      const apiKey = await refetchEntity(
        "api_key",
        { token: publishableApiKey },
        req.scope,
        ["id", "sales_channels_link.sales_channel_id"]
      )

      if (!apiKey) {
        return next(
          new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Publishable API key not found`
          )
        )
      }
      let result = apiKey.sales_channels_link.map(
        (link) => link.sales_channel_id
      )

      if (salesChannelIds?.length) {
        // If all sales channel ids are not in the publishable key, we throw an error
        const uniqueInParams = arrayDifference(salesChannelIds, result)
        if (uniqueInParams.length) {
          return next(
            new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Requested sales channel is not part of the publishable key mappings`
            )
          )
        }
        result = salesChannelIds
      }

      req.filterableFields.sales_channel_id = result
      return next()
    }

    if (salesChannelIds?.length) {
      req.filterableFields.sales_channel_id = salesChannelIds
      return next()
    }

    const store = await refetchEntity("stores", {}, req.scope, [
      "default_sales_channel_id",
    ])

    if (!store) {
      return next(
        new MedusaError(MedusaError.Types.INVALID_DATA, `Store not found`)
      )
    }

    if (store.default_sales_channel_id) {
      req.filterableFields.sales_channel_id = [store.default_sales_channel_id]
    }

    return next()
  }
}
