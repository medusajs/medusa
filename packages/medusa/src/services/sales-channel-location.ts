import { EntityManager } from "typeorm"
import { IStockLocationService } from "../interfaces/services"
import { SalesChannelService, EventBusService } from "./"

import { SalesChannelLocation } from "../models"

type InjectedDependencies = {
  stockLocationService: IStockLocationService
  salesChannelService: SalesChannelService
  eventBusService: EventBusService
  manager: EntityManager
}

class SalesChannelLocationService {
  protected manager: EntityManager

  protected readonly salesChannelService: SalesChannelService
  protected readonly eventBusService: EventBusService
  protected readonly stockLocationService: IStockLocationService

  constructor({
    salesChannelService,
    stockLocationService,
    eventBusService,
    manager,
  }: InjectedDependencies) {
    this.manager = manager
    this.salesChannelService = salesChannelService
    this.eventBusService = eventBusService
    this.stockLocationService = stockLocationService
  }

  async removeLocation(
    salesChannelId: string,
    locationId: string
  ): Promise<void> {
    await this.manager.delete(SalesChannelLocation, {
      sales_channel_id: salesChannelId,
      location_id: locationId,
    })
  }

  async associateLocation(
    salesChannelId: string,
    locationId: string
  ): Promise<void> {
    const salesChannel = await this.salesChannelService.retrieve(salesChannelId)
    const stockLocation = await this.stockLocationService.retrieve(locationId)

    const salesChannelLocation = this.manager.create(SalesChannelLocation, {
      sales_channel_id: salesChannel.id,
      location_id: stockLocation.id,
    })

    await this.manager.save(salesChannelLocation)
  }

  async listLocations(salesChannelId: string): Promise<string[]> {
    const salesChannel = await this.salesChannelService.retrieve(salesChannelId)

    const locations = await this.manager.find(SalesChannelLocation, {
      where: { sales_channel_id: salesChannel.id },
    })

    return locations.map((l) => l.location_id)
  }
}

export default SalesChannelLocationService
