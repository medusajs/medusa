// import {
//   CreateInventoryLevelInput,
//   FilterableInventoryLevelProps,
//   FindConfig,
//   IEventBusService,
//   SharedContext,
// } from "@medusajs/types"
// import {
//   InjectEntityManager,
//   MedusaContext,
//   MedusaError,
//   isDefined,
// } from "@medusajs/utils"
// import { DeepPartial, EntityManager, FindManyOptions, In } from "typeorm"
// import { InventoryLevel } from "../models"
// import { buildQuery } from "../utils/build-query"

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

  /**
   * Deletes inventory levels by inventory Item ID.
   * @param inventoryItemId - The ID or IDs of the inventory item to delete inventory levels for.
   * @param context
   */
  async deleteByInventoryItemId(
    inventoryItemId: string | string[],
    context: Context = {}
  ): Promise<void> {
    // const ids = Array.isArray(inventoryItemId)
    //   ? inventoryItemId
    //   : [inventoryItemId]
    // const manager = context.transactionManager!
    // const levelRepository = manager.getRepository(InventoryLevel)
    // await levelRepository.softDelete({ inventory_item_id: In(ids) })
    // await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
    //   inventory_item_id: inventoryItemId,
    // })
  }

  /**
   * Restores inventory levels by inventory Item ID.
   * @param inventoryItemId - The ID or IDs of the inventory item to restore inventory levels for.
   * @param context
   */
  async restoreByInventoryItemId(
    inventoryItemId: string | string[],
    context: Context = {}
  ): Promise<void> {
    // const ids = Array.isArray(inventoryItemId)
    //   ? inventoryItemId
    //   : [inventoryItemId]
    // const manager = context.transactionManager!
    // const levelRepository = manager.getRepository(InventoryLevel)
    // await levelRepository.restore({ inventory_item_id: In(ids) })
    // await this.eventBusService_?.emit?.(InventoryLevelService.Events.RESTORED, {
    //   inventory_item_id: inventoryItemId,
    // })
  }

  async deleteByLocationId(
    locationId: string | string[],
    context: Context = {}
  ): Promise<[object[], Record<string, unknown[]>]> {
    return await this.inventoryLevelRepository.softDelete(
      { location_id: locationId },
      context
    )
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
