import { isPresent, MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { AuthenticatedMedusaRequest } from "../../../../types/routing"
import { refetchEntity } from "../../refetch-entity"

export function filterByValidSalesChannels() {
  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const publishableApiKey = req.get("x-publishable-api-key")
    const salesChannelIds = req.filterableFields.sales_channel_id as
      | string[]
      | undefined

    const store = await refetchEntity("stores", {}, req.scope, [
      "default_sales_channel_id",
    ])

    if (!store) {
      try {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Store not found`)
      } catch (e) {
        return next(e)
      }
    }
    // Always set sales channels in the following priority
    // - any existing sales chennel ids passed through query params
    // - if none, we set the default sales channel
    req.filterableFields.sales_channel_id = salesChannelIds ?? [
      store.default_sales_channel_id,
    ]

    // Return early if no publishable keys are found
    if (!isPresent(publishableApiKey)) {
      return next()
    }

    // When publishable keys are present, we fetch for all sales chennels attached
    // to the publishable key and validate the sales channel filter against it
    const apiKey = await refetchEntity(
      "api_key",
      { token: publishableApiKey },
      req.scope,
      ["id", "sales_channels_link.sales_channel_id"]
    )

    if (!apiKey) {
      try {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Publishable API key not found`
        )
      } catch (e) {
        return next(e)
      }
    }

    const validSalesChannelIds = apiKey.sales_channels_link.map(
      (link) => link.sales_channel_id
    )

    const invalidSalesChannelIds = (salesChannelIds || []).filter(
      (id) => !validSalesChannelIds.includes(id)
    )

    if (invalidSalesChannelIds.length) {
      try {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid sales channel filters provided - ${invalidSalesChannelIds.join(
            ", "
          )}`
        )
      } catch (e) {
        return next(e)
      }
    }

    return next()
  }
}
