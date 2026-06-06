import { Context } from "@zjedene-medusa/framework/types"
import { BigNumber, ModulesSdkUtils } from "@zjedene-medusa/framework/utils"
import { applyEntityHooks } from "../utils/apply-decorators"

import { InventoryLevel } from "@models"
import { InventoryLevelRepository } from "@repositories"

type InjectedDependencies = {
  inventoryLevelRepository: InventoryLevelRepository
}

export default class InventoryLevelService extends ModulesSdkUtils.MedusaInternalService<
  InjectedDependencies,
  typeof InventoryLevel
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
  ): Promise<BigNumber> {
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
  ): Promise<BigNumber> {
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

applyEntityHooks()
