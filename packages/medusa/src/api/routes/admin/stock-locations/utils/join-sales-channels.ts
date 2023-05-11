import { StockLocationDTO, StockLocationExpandedDTO } from "@medusajs/types"
import {
  SalesChannelLocationService,
  SalesChannelService,
} from "../../../../../services"
import { EntityManager } from "typeorm"

const joinSalesChannels = async (
  locations: StockLocationDTO[],
  channelLocationService: SalesChannelLocationService,
  salesChannelService: SalesChannelService,
  manager: EntityManager
): Promise<StockLocationExpandedDTO[]> => {
  return await Promise.all(
    locations.map(async (location: StockLocationExpandedDTO) => {
      const salesChannelIds = await channelLocationService
        .withTransaction(manager)
        .listSalesChannelIds(location.id)

      const [salesChannels] = await salesChannelService.listAndCount(
        {
          id: salesChannelIds,
        },
        {}
      )

      location.sales_channels = salesChannels

      return location
    })
  )
}

export { joinSalesChannels }
