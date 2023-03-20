import { EntityManager } from "typeorm"

import { EventBusService, SalesChannelLocationService } from "./"
import { IInventoryService, TransactionBaseService } from "../interfaces"

type InjectedDependencies = {
  inventoryService: IInventoryService
  salesChannelLocationService: SalesChannelLocationService
  eventBusService: EventBusService
  manager: EntityManager
}

class SalesChannelInventoryService extends TransactionBaseService {
  protected readonly salesChannelLocationService_: SalesChannelLocationService
  protected readonly eventBusService_: EventBusService
  protected readonly inventoryService_: IInventoryService

  constructor({
    salesChannelLocationService,
    inventoryService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.salesChannelLocationService_ = salesChannelLocationService
    this.eventBusService_ = eventBusService
    this.inventoryService_ = inventoryService
  }

  /**
   * Retrieves the available quantity of an item across all sales channel locations
   * @param salesChannelId Sales channel id
   * @param inventoryItemId Item id
   * @returns available quantity of item across all sales channel locations
   */
  async retrieveAvailableItemQuantity(
    salesChannelId: string,
    inventoryItemId: string
  ): Promise<number> {
    const locationIds = await this.salesChannelLocationService_
      .withTransaction(this.activeManager_)
      .listLocationIds(salesChannelId)

    return await this.inventoryService_.retrieveAvailableQuantity(
      inventoryItemId,
      locationIds
    )
  }
}

export default SalesChannelInventoryService
