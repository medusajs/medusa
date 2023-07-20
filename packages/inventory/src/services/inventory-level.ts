import {
  Context,
  CreateInventoryLevelInput,
  FilterableInventoryLevelProps,
  FindConfig,
  IEventBusService,
  SharedContext,
  UpdateInventoryLevelInput,
} from "@medusajs/types"
import {
  InjectEntityManager,
  InjectTransactionManager,
  isDefined,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { DeepPartial, EntityManager, FindManyOptions, In } from "typeorm"
import { InventoryLevel } from "../models"
import { buildQuery } from "../utils/build-query"
import { InventoryLevelRepository } from "../repositories"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  eventBusService: IEventBusService
  inventoryLevelRepository: InventoryLevelRepository
  manager: EntityManager
}

export default class InventoryLevelService {
  static Events = {
    CREATED: "inventory-level.created",
    UPDATED: "inventory-level.updated",
    DELETED: "inventory-level.deleted",
  }

  protected readonly manager_: EntityManager
  protected readonly eventBusService_: IEventBusService | undefined
  protected readonly inventoryLevelRepository: InventoryLevelRepository

  constructor({ eventBusService, manager }: InjectedDependencies) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
  }

  /**
   * Retrieves a list of inventory levels based on the provided selector and configuration.
   * @param selector - An object containing filterable properties for inventory levels.
   * @param config - An object containing configuration options for the query.
   * @param context
   * @return Array of inventory levels.
   */
  async list(
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 },
    context: Context = {}
  ): Promise<InventoryLevel[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<InventoryLevel>(
      selector,
      config
    )

    return await this.inventoryLevelRepository.find(queryOptions, context)
  }

  /**
   * Retrieves a list of inventory levels and a count based on the provided selector and configuration.
   * @param selector - An object containing filterable properties for inventory levels.
   * @param config - An object containing configuration options for the query.
   * @param context
   * @return An array of inventory levels and a count.
   */
  async listAndCount(
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 },
    context: Context = {}
  ): Promise<[InventoryLevel[], number]> {
    // const manager = context.transactionManager ?? this.manager_
    // const levelRepository = manager.getRepository(InventoryLevel)

    // const query = buildQuery(selector, config) as FindManyOptions
    // return await levelRepository.findAndCount(query)
    const queryOptions = ModulesSdkUtils.buildQuery<InventoryLevel>(
      selector,
      config
    )

    return await this.inventoryLevelRepository.findAndCount(
      queryOptions,
      context
    )
  }

  /**
   * Retrieves a single inventory level by its ID.
   * @param inventoryLevelId - The ID of the inventory level to retrieve.
   * @param config - An object containing configuration options for the query.
   * @param context
   * @return A inventory level.
   * @throws If the inventory level ID is not defined or the given ID was not found.
   */
  async retrieve(
    inventoryLevelId: string,
    config: FindConfig<InventoryLevel> = {},
    context: Context = {}
  ): Promise<InventoryLevel> {
    if (!isDefined(inventoryLevelId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"inventoryLevelId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<InventoryLevel>(
      { id: inventoryLevelId },
      config
    )

    const [inventoryLevel] = await this.inventoryLevelRepository.find(
      queryOptions,
      context
    )

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `InventoryLevel with id ${inventoryLevelId} was not found`
      )
    }

    return inventoryLevel
  }

  /**
   * Creates a new inventory level.
   * @param data - An object containing the properties for the new inventory level.
   * @param context
   * @return The created inventory level.
   */
  @InjectTransactionManager(doNotForceTransaction, "inventoryLevelRepository")
  async create(
    data: CreateInventoryLevelInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryLevel[]> {
    const result = await this.inventoryLevelRepository.create(data, context)

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.CREATED, {
      ids: result.map((i) => i.id),
    })

    return result
  }

  /**
   * Updates an existing inventory level.
   * @param inventoryLevelId - The ID of the inventory level to update.
   * @param data - An object containing the properties to update on the inventory level.
   * @param context
   * @return The updated inventory level.
   * @throws If the inventory level ID is not defined or the given ID was not found.
   */
  @InjectTransactionManager(doNotForceTransaction, "inventoryLevelRepository")
  async update(
    inventoryLevelId: string,
    data: UpdateInventoryLevelInput,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryLevel> {
    const item = await this.retrieve(inventoryLevelId, undefined, context)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (!shouldUpdate) {
      return item
    }

    const [updatedItem] = await this.inventoryLevelRepository.update(
      [{ item, update: data }],
      context
    )

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.UPDATED, {
      id: item.id,
    })

    return updatedItem
  }

  /**
   * Adjust the reserved quantity for an inventory item at a specific location.
   * @param inventoryItemId - The ID of the inventory item.
   * @param locationId - The ID of the location.
   * @param quantity - The quantity to adjust from the reserved quantity.
   * @param context
   */
  @InjectTransactionManager(doNotForceTransaction, "inventoryLevelRepository")
  async adjustReservedQuantity(
    inventoryItemId: string,
    locationId: string,
    quantity: number,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.inventoryLevelRepository.adjustReservedQuantity(
      inventoryItemId,
      locationId,
      quantity
    )
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
  @InjectTransactionManager(doNotForceTransaction, "inventoryLevelRepository")
  async deleteByInventoryItemId(
    inventoryItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const ids = Array.isArray(inventoryItemId)
      ? inventoryItemId
      : [inventoryItemId]

    const inventoryLevels = await this.list(
      { inventory_item_id: ids },
      { select: ["id"] },
      context
    )

    await this.inventoryLevelRepository.delete(
      inventoryLevels.map((i) => i.id),
      context
    )

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      inventory_item_id: inventoryItemId,
    })
  }

  /**
   * Deletes an inventory level by ID.
   * @param inventoryLevelId - The ID or IDs of the inventory level to delete.
   * @param context
   */
  @InjectTransactionManager(doNotForceTransaction, "inventoryLevelRepository")
  async delete(
    inventoryLevelId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const ids = Array.isArray(inventoryLevelId)
      ? inventoryLevelId
      : [inventoryLevelId]

    await this.inventoryLevelRepository.delete(ids, context)

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      ids: inventoryLevelId,
    })
  }

  /**
   * Deletes inventory levels by location ID.
   * @param locationId - The ID of the location to delete inventory levels for.
   * @param context
   */
  @InjectTransactionManager(doNotForceTransaction, "inventoryLevelRepository")
  async deleteByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const ids = Array.isArray(locationId) ? locationId : [locationId]

    const inventoryLevels = await this.list(
      { location_id: ids },
      { select: ["id"] },
      context
    )

    await this.inventoryLevelRepository.delete(
      inventoryLevels.map((i) => i.id),
      context
    )

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      location_ids: ids,
    })
  }

  /**
   * Gets the total stocked quantity for a specific inventory item at multiple locations.
   * @param inventoryItemId - The ID of the inventory item.
   * @param locationIds - The IDs of the locations.
   * @param context
   * @return The total stocked quantity.
   */
  async getStockedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    context: Context = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    return await this.inventoryLevelRepository.getStockedQuantity(
      inventoryItemId,
      locationIds,
      context
    )

    // const result = await levelRepository
    //   .createQueryBuilder()
    //   .select("SUM(stocked_quantity)", "quantity")
    //   .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
    //   .andWhere("location_id IN (:...locationIds)", { locationIds })
    //   .getRawOne()
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
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    return this.inventoryLevelRepository.getAvailableQuantity(
      inventoryItemId,
      locationIds,
      context
    )

    // const manager = context.transactionManager ?? this.manager_
    // const levelRepository = manager.getRepository(InventoryLevel)

    // const result = await levelRepository
    //   .createQueryBuilder()
    //   .select("SUM(stocked_quantity - reserved_quantity)", "quantity")
    //   .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
    //   .andWhere("location_id IN (:...locationIds)", { locationIds })
    //   .getRawOne()

    // return parseFloat(result.quantity)
  }

  /**
   * Gets the total reserved quantity for a specific inventory item at multiple locations.
   * @param inventoryItemId - The ID of the inventory item.
   * @param locationIds - The IDs of the locations.
   * @param context
   * @return The total reserved quantity.
   */
  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    context: Context = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    return await this.inventoryLevelRepository.getReservedQuantity(
      inventoryItemId,
      locationIds,
      context
    )

    // const manager = context.transactionManager ?? this.manager_
    // const levelRepository = manager.getRepository(InventoryLevel)

    // const result = await levelRepository
    //   .createQueryBuilder()
    //   .select("SUM(reserved_quantity)", "quantity")
    //   .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
    //   .andWhere("location_id IN (:...locationIds)", { locationIds })
    //   .getRawOne()

    // return parseFloat(result.quantity)
  }
}
