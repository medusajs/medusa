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
  protected manager: EntityManager

  protected readonly salesChannelLocationService: SalesChannelLocationService
  protected readonly eventBusService: EventBusService
  protected readonly inventoryService: IInventoryService

  constructor({
    salesChannelLocationService,
    inventoryService,
    eventBusService,
    manager,
  }: InjectedDependencies) {
    this.manager = manager
    this.salesChannelLocationService = salesChannelLocationService
    this.eventBusService = eventBusService
    this.inventoryService = inventoryService
  }

  async retrieveAvailableItemQuantity(
    salesChannelId: string,
    itemId: string
  ): Promise<number> {
    const locations = await this.salesChannelLocationService.listLocations(
      salesChannelId
    )

    return await this.inventoryService.retrieveAvailableQuantity(
      itemId,
      locations
    )
  }
}

export default SalesChannelInventoryService
