import { EntityManager } from "typeorm"
import { IStockLocationService, TransactionBaseService } from "../interfaces"
import { SalesChannelService, EventBusService } from "./"

import { SalesChannelLocation } from "../models/sales-channel-location"

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
   * @param salesChannelId - The ID of the sales channel or undefined if all the sales channel will be affected.
   * @param locationId - The ID of the stock location.
   * @returns A promise that resolves when the association has been removed.
   */
  async removeLocation(
    locationId: string,
    salesChannelId?: string
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_

    const salesChannelLocationRepo = manager.getRepository(SalesChannelLocation)

    const where: any = {
      location_id: locationId,
    }
    if (salesChannelId) {
      where.sales_channel_id = salesChannelId
    }

    const scLoc = await salesChannelLocationRepo.find({
      where,
    })

    if (scLoc.length) {
      await salesChannelLocationRepo.remove(scLoc)
    }
  }

  /**
   * Associates a sales channel with a stock location.
   * @param salesChannelId - The ID of the sales channel.
   * @param locationId - The ID of the stock location.
   * @returns A promise that resolves when the association has been created.
   */
  async associateLocation(
    salesChannelId: string,
    locationId: string
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_
    const salesChannel = await this.salesChannelService_
      .withTransaction(manager)
      .retrieve(salesChannelId)

    if (this.stockLocationService) {
      // trhows error if not found
      await this.stockLocationService.retrieve(locationId)
    }

    const salesChannelLocation = manager.create(SalesChannelLocation, {
      sales_channel_id: salesChannel.id,
      location_id: locationId,
    })

    await manager.save(salesChannelLocation)
  }

  /**
   * Lists the stock locations associated with a sales channel.
   * @param salesChannelId - The ID of the sales channel.
   * @returns A promise that resolves with an array of location IDs.
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
