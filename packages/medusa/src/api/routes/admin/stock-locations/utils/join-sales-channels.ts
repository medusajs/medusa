import {
  SalesChannelLocationService,
  SalesChannelService,
} from "../../../../../services"
import { StockLocationDTO } from "../../../../../types/stock-location"

const joinSalesChannels = async (
  locations: StockLocationDTO[],
  channelLocationService: SalesChannelLocationService,
  salesChannelService: SalesChannelService
): Promise<StockLocationDTO[]> => {
  return await Promise.all(
    locations.map(async (location) => {
      const salesChannelIds = await channelLocationService.listSalesChannels(
        location.id
      )
      const [salesChannels] = await salesChannelService.listAndCount({
        id: salesChannelIds,
      })

      location["sales_channels"] = salesChannels

      return location
    })
  )
}

export { joinSalesChannels }
