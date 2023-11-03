import { EventBusTypes, IInventoryService } from "@medusajs/types"
import { TransactionBaseService } from "../interfaces"
import { EntityManager } from "typeorm"
import SalesChannelLocationService from "./sales-channel-location"

type InjectedDependencies = {
  inventoryService: IInventoryService
  salesChannelLocationService: SalesChannelLocationService
  eventBusService: EventBusTypes.IEventBusService
  manager: EntityManager
}

class SalesChannelInventoryService extends TransactionBaseService {
  protected readonly salesChannelLocationService_: SalesChannelLocationService
  protected readonly eventBusService_: EventBusTypes.IEventBusService

  protected get inventoryService_(): IInventoryService {
    return this.__container__.inventoryService
  }

  constructor({
    salesChannelLocationService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.salesChannelLocationService_ = salesChannelLocationService
    this.eventBusService_ = eventBusService
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
