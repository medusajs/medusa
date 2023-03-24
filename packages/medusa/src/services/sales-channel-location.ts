import { IEventBusService, IStockLocationService } from "@medusajs/types"
import { MedusaError } from "medusa-core-utils"
import { EntityManager, In } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { SalesChannelLocation } from "../models/sales-channel-location"
import SalesChannelService from "./sales-channel"


type InjectedDependencies = {
  stockLocationService: IStockLocationService
  salesChannelService: SalesChannelService
  eventBusService: IEventBusService
  manager: EntityManager
}

/**
 * Service for managing the stock locations of sales channels
 */

class SalesChannelLocationService extends TransactionBaseService {
  protected readonly salesChannelService_: SalesChannelService
  protected readonly eventBusService_: IEventBusService
  protected readonly stockLocationService_: IStockLocationService

  constructor({
    salesChannelService,
    stockLocationService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.salesChannelService_ = salesChannelService
    this.eventBusService_ = eventBusService
    this.stockLocationService_ = stockLocationService
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
    const salesChannelLocationRepo =
      this.activeManager_.getRepository(SalesChannelLocation)

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
    const salesChannel = await this.salesChannelService_
      .withTransaction(this.activeManager_)
      .retrieve(salesChannelId)

    if (this.stockLocationService_) {
      // trhows error if not found
      await this.stockLocationService_.retrieve(locationId)
    }

    const salesChannelLocation = this.activeManager_.create(
      SalesChannelLocation,
      {
        sales_channel_id: salesChannel.id,
        location_id: locationId,
      }
    )

    await this.activeManager_.save(salesChannelLocation)
  }

  /**
   * Lists the stock locations associated with a sales channel.
   * @param salesChannelId - The ID of the sales channel.
   * @returns A promise that resolves with an array of location IDs.
   */
  async listLocationIds(salesChannelId: string | string[]): Promise<string[]> {
    const ids = Array.isArray(salesChannelId)
      ? salesChannelId
      : [salesChannelId]

    const [salesChannels, count] = await this.salesChannelService_
      .withTransaction(this.activeManager_)
      .listAndCount({ id: ids }, { select: ["id"], skip: 0 })

    if (!count) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Sales channel with id: ${ids.join(", ")} was not found`
      )
    }

    const locations = await this.activeManager_.find(SalesChannelLocation, {
      where: { sales_channel_id: In(salesChannels.map((sc) => sc.id)) },
      select: ["location_id"],
    })

    return locations.map((l) => l.location_id)
  }

  /**
   * Lists the sales channels associated with a stock location.
   * @param {string} salesChannelId - The ID of the stock location.
   * @returns {Promise<string[]>} A promise that resolves with an array of sales channel IDs.
   */
  async listSalesChannelIds(locationId: string): Promise<string[]> {
    const manager = this.transactionManager_ || this.manager_
    const location = await this.stockLocationService_.retrieve(locationId)

    const salesChannelLocations = await manager.find(SalesChannelLocation, {
      where: { location_id: location.id },
      select: ["sales_channel_id"],
    })

    return salesChannelLocations.map((l) => l.sales_channel_id)
  }
}

export default SalesChannelLocationService
