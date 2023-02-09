import { EntityManager } from "typeorm"

import { IInventoryService } from "../interfaces/services"

import { SalesChannelLocationService, EventBusService } from "./"

type InjectedDependencies = {
  inventoryService: IInventoryService
  salesChannelLocationService: SalesChannelLocationService
  eventBusService: EventBusService
  manager: EntityManager
}

class SalesChannelInventoryService {
  protected manager_: EntityManager

  protected readonly salesChannelLocationService_: SalesChannelLocationService
  protected readonly eventBusService_: EventBusService
  protected readonly inventoryService_: IInventoryService

  constructor({
    salesChannelLocationService,
    inventoryService,
    eventBusService,
    manager,
  }: InjectedDependencies) {
    this.manager_ = manager
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
    const locations = await this.salesChannelLocationService_.listLocations(
      salesChannelId
    )

    return await this.inventoryService_.retrieveAvailableQuantity(
      inventoryItemId,
      locations
    )
  }
}

export default SalesChannelInventoryService
