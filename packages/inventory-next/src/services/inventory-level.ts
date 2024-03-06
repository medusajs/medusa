import {
  Context,
  CreateInventoryLevelInput,
  DAL,
  SharedContext,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

import { InventoryLevel } from "../models/inventory-level"
import { InventoryLevelRepository } from "@repositories"

type InjectedDependencies = {
  inventoryLevelRepository: InventoryLevelRepository
}

export default class InventoryLevelService<
  TEntity extends InventoryLevel = InventoryLevel
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  InventoryLevel
)<TEntity> {
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
