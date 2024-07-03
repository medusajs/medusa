import { Context } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

import { InventoryLevelRepository } from "@repositories"
import { InventoryLevel } from "../models/inventory-level"

type InjectedDependencies = {
  inventoryLevelRepository: InventoryLevelRepository
}

export default class InventoryLevelService extends ModulesSdkUtils.MedusaInternalService<
  InjectedDependencies,
  InventoryLevel
>(InventoryLevel) {
  protected readonly inventoryLevelRepository: InventoryLevelRepository

  constructor(container: InjectedDependencies) {
    super(container)
    this.inventoryLevelRepository = container.inventoryLevelRepository
  }

  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    context: Context = {}
  ): Promise<number> {
    const locationIdArray = Array.isArray(locationIds)
      ? locationIds
      : [locationIds]

    return await this.inventoryLevelRepository.getStockedQuantity(
      inventoryItemId,
      locationIdArray,
      context
    )
  }

  async getAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    context: Context = {}
  ): Promise<number> {
    const locationIdArray = Array.isArray(locationIds)
      ? locationIds
      : [locationIds]

    return await this.inventoryLevelRepository.getAvailableQuantity(
      inventoryItemId,
      locationIdArray,
      context
    )
  }

  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    context: Context = {}
  ) {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    return await this.inventoryLevelRepository.getReservedQuantity(
      inventoryItemId,
      locationIds,
      context
    )
  }
}
