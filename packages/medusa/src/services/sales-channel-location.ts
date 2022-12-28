import { EntityManager } from "typeorm"
import { IStockLocationService, TransactionBaseService } from "../interfaces"
import { SalesChannelService, EventBusService } from "./"

import { SalesChannelLocation } from "../models"

type InjectedDependencies = {
  stockLocationService: IStockLocationService
  salesChannelService: SalesChannelService
  eventBusService: EventBusService
  manager: EntityManager
}

class SalesChannelLocationService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly salesChannelService_: SalesChannelService
  protected readonly eventBusService_: EventBusService
  protected readonly stockLocationService_: IStockLocationService

  constructor({
    salesChannelService,
    stockLocationService,
    eventBusService,
    manager,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.salesChannelService_ = salesChannelService
    this.eventBusService_ = eventBusService
    this.stockLocationService_ = stockLocationService
  }

  /**
   * Removes location from sales channel
   * @param salesChannelId sales channel id
   * @param locationId location id
   */
  async removeLocation(
    salesChannelId: string,
    locationId: string
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_
    await manager.delete(SalesChannelLocation, {
      sales_channel_id: salesChannelId,
      location_id: locationId,
    })
  }

  /**
   * Links location to sales channel
   * @param salesChannelId sales channel id
   * @param locationId location id
   */
  async associateLocation(
    salesChannelId: string,
    locationId: string
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_
    const salesChannel = await this.salesChannelService_
      .withTransaction(manager)
      .retrieve(salesChannelId)
    const stockLocation = await this.stockLocationService_.retrieve(locationId)

    const salesChannelLocation = manager.create(SalesChannelLocation, {
      sales_channel_id: salesChannel.id,
      location_id: stockLocation.id,
    })

    await manager.save(salesChannelLocation)
  }

  /**
   * Lists all locations associated with sales channel by id
   * @param salesChannelId sales channel id
   * @returns list of location ids associated with sales channel
   */
  async listLocations(salesChannelId: string): Promise<string[]> {
    const manager = this.transactionManager_ || this.manager_
    const salesChannel = await this.salesChannelService_
      .withTransaction(manager)
      .retrieve(salesChannelId)

    const locations = await manager.find(SalesChannelLocation, {
      where: { sales_channel_id: salesChannel.id },
    })

    return locations.map((l) => l.location_id)
  }
}

export default SalesChannelLocationService
