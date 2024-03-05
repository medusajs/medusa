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

  /**
   * Adjust the reserved quantity for an inventory item at a specific location.
   * @param inventoryItemId - The ID of the inventory item.
   * @param locationId - The ID of the location.
   * @param quantity - The quantity to adjust from the reserved quantity.
   * @param context
   */
  async adjustReservedQuantity(
    inventoryItemId: string,
    locationId: string,
    quantity: number,
    context: Context = {}
  ): Promise<void> {
    // const manager = context.transactionManager!
    // await manager
    //   .createQueryBuilder()
    //   .update(InventoryLevel)
    //   .set({ reserved_quantity: () => `reserved_quantity + ${quantity}` })
    //   .where(
    //     "inventory_item_id = :inventoryItemId AND location_id = :locationId",
    //     { inventoryItemId, locationId }
    //   )
    //   .execute()
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

  /**
   * Gets the total available quantity for a specific inventory item at multiple locations.
   * @param inventoryItemId - The ID of the inventory item.
   * @param locationIds - The IDs of the locations.
   * @param context
   * @return The total available quantity.
   */
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
