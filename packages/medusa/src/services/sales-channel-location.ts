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

/**
 * Service for managing the stock locations of sales channels
 */

class SalesChannelLocationService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly salesChannelService_: SalesChannelService
  protected readonly eventBusService: EventBusService
  protected readonly stockLocationService: IStockLocationService

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
    this.eventBusService = eventBusService
    this.stockLocationService = stockLocationService
  }

  /**
   * Removes an association between a sales channel and a stock location.
   * @param {string} salesChannelId - The ID of the sales channel.
   * @param {string} locationId - The ID of the stock location.
   * @returns {Promise<void>} A promise that resolves when the association has been removed.
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
   * Associates a sales channel with a stock location.
   * @param {string} salesChannelId - The ID of the sales channel.
   * @param {string} locationId - The ID of the stock location.
   * @returns {Promise<void>} A promise that resolves when the association has been created.
   */
  async associateLocation(
    salesChannelId: string,
    locationId: string
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_
    const salesChannel = await this.salesChannelService_
      .withTransaction(manager)
      .retrieve(salesChannelId)

    const stockLocationId = locationId

    if (this.stockLocationService) {
      const stockLocation = await this.stockLocationService.retrieve(locationId)
      locationId = stockLocation.id
    }

    const salesChannelLocation = manager.create(SalesChannelLocation, {
      sales_channel_id: salesChannel.id,
      location_id: stockLocationId,
    })

    await manager.save(salesChannelLocation)
  }

  /**
   * Lists the stock locations associated with a sales channel.
   * @param {string} salesChannelId - The ID of the sales channel.
   * @returns {Promise<string[]>} A promise that resolves with an array of location IDs.
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
