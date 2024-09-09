import { MedusaStoreRequest } from "@medusajs/framework"
import { arrayDifference, MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { refetchEntity } from "../../refetch-entity"

// Selection of sales channels happens in the following priority:
// - If a publishable API key is passed, we take the sales channels attached to it and filter them down based on the query params
// - If a sales channel id is passed through query params, we use that
// - If not, we use the default sales channel for the store
export function filterByValidSalesChannels() {
  return async (req: MedusaStoreRequest, _, next: NextFunction) => {
    const idsFromRequest = req.filterableFields.sales_channel_id
    const { sales_channel_ids: idsFromPublishableKey = [] } =
      req.publishable_key_context

    // If all sales channel ids are not in the publishable key, we throw an error
    if (Array.isArray(idsFromRequest) && idsFromRequest.length) {
      const uniqueInParams = arrayDifference(
        idsFromRequest,
        idsFromPublishableKey
      )

      if (uniqueInParams.length) {
        return next(
          new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Requested sales channel is not part of the publishable key`
          )
        )
      }

      req.filterableFields.sales_channel_id = idsFromRequest

      return next()
    }

    if (idsFromPublishableKey?.length) {
      req.filterableFields.sales_channel_id = idsFromPublishableKey

      return next()
    }

    // Q: If no sales channel IDs were found in the publishable key, should we throw an error
    // here instead of going forward with this with the default sales channel
    const store = await refetchEntity("stores", {}, req.scope, [
      "default_sales_channel_id",
    ])

    if (!store) {
      return next(
        new MedusaError(MedusaError.Types.INVALID_DATA, `Store not found`)
      )
    }

    if (!store.default_sales_channel_id) {
      return next(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Default sales channel not found`
        )
      )
    }

    req.filterableFields.sales_channel_id = [store.default_sales_channel_id]

    return next()
  }
}
