import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { AdminGetStockLocationsParams } from "../validators"
import { MedusaRequest } from "../../../../types/routing"
import { Modules } from "@medusajs/modules-sdk"
import { NextFunction } from "express"

export function applySalesChannelsFilter() {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    const filterableFields: AdminGetStockLocationsParams = req.filterableFields

    if (!filterableFields.sales_channel_id) {
      return next()
    }

    const salesChannelIds = Array.isArray(filterableFields.sales_channel_id)
      ? filterableFields.sales_channel_id
      : [filterableFields.sales_channel_id]

    delete filterableFields.sales_channel_id

    const remoteLinkService = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    const stockLocationSalesChannelLinkModuleService =
      await remoteLinkService.getLinkModule(
        Modules.SALES_CHANNEL,
        "sales_channel_id",
        Modules.STOCK_LOCATION,
        "stock_location_id"
      )

    const stockLocationSalesChannelLinks =
      await stockLocationSalesChannelLinkModuleService.list(
        { sales_channel_id: salesChannelIds },
        {}
      )

    filterableFields.id = stockLocationSalesChannelLinks.map(
      (link) => link.stock_location_id
    )

    return next()
  }
}
