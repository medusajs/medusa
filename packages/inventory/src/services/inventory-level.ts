import {
  CreateInventoryLevelInput,
  FilterableInventoryLevelProps,
  FindConfig,
  IEventBusService,
  SharedContext,
} from "@medusajs/types"
import {
  InjectEntityManager,
  MedusaContext,
  MedusaError,
  isDefined,
} from "@medusajs/utils"
import { DeepPartial, EntityManager, FindManyOptions, In } from "typeorm"
import { InventoryLevel } from "../models"
import { buildQuery } from "../utils/build-query"

type InjectedDependencies = {
  eventBusService: IEventBusService
  manager: EntityManager
}

export default class InventoryLevelService {
  static Events = {
    CREATED: "inventory-level.created",
    UPDATED: "inventory-level.updated",
    DELETED: "inventory-level.deleted",
    RESTORED: "inventory-level.restored",
  }

  protected readonly manager_: EntityManager
  protected readonly eventBusService_: IEventBusService | undefined

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
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryLevel[]> {
    const manager = context.transactionManager ?? this.manager_
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config) as FindManyOptions
    return await levelRepository.find(query)
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<[InventoryLevel[], number]> {
    const manager = context.transactionManager ?? this.manager_
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config) as FindManyOptions
    return await levelRepository.findAndCount(query)
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryLevel> {
    if (!isDefined(inventoryLevelId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"inventoryLevelId" must be defined`
      )
    }

    const manager = context.transactionManager ?? this.manager_
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(
      { id: inventoryLevelId },
      config
    ) as FindManyOptions
    const [inventoryLevel] = await levelRepository.find(query)

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
  @InjectEntityManager()
  async create(
    data: CreateInventoryLevelInput[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryLevel[]> {
    const manager = context.transactionManager!

    const toCreate = data.map((d) => {
      return {
        location_id: d.location_id,
        inventory_item_id: d.inventory_item_id,
        stocked_quantity: d.stocked_quantity,
        reserved_quantity: d.reserved_quantity,
        incoming_quantity: d.incoming_quantity,
      }
    })

    const levelRepository = manager.getRepository(InventoryLevel)

    const inventoryLevels = levelRepository.create(toCreate)

    const saved = await levelRepository.save(inventoryLevels)
    await this.eventBusService_?.emit?.(InventoryLevelService.Events.CREATED, {
      ids: saved.map((i) => i.id),
    })

    return saved
  }

  /**
   * Updates an existing inventory level.
   * @param inventoryLevelId - The ID of the inventory level to update.
   * @param data - An object containing the properties to update on the inventory level.
   * @param context
   * @return The updated inventory level.
   * @throws If the inventory level ID is not defined or the given ID was not found.
   */
  @InjectEntityManager()
  async update(
    inventoryLevelId: string,
    data: Omit<
      DeepPartial<InventoryLevel>,
      "id" | "created_at" | "metadata" | "deleted_at"
    >,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryLevel> {
    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    const item = await this.retrieve(inventoryLevelId, undefined, context)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (shouldUpdate) {
      levelRepository.merge(item, data)
      await levelRepository.save(item)

      await this.eventBusService_?.emit?.(
        InventoryLevelService.Events.UPDATED,
        {
          id: item.id,
        }
      )
    }

    return item
  }

  /**
   * Adjust the reserved quantity for an inventory item at a specific location.
   * @param inventoryItemId - The ID of the inventory item.
   * @param locationId - The ID of the location.
   * @param quantity - The quantity to adjust from the reserved quantity.
   * @param context
   */
  @InjectEntityManager()
  async adjustReservedQuantity(
    inventoryItemId: string,
    locationId: string,
    quantity: number,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    await manager
      .createQueryBuilder()
      .update(InventoryLevel)
      .set({ reserved_quantity: () => `reserved_quantity + ${quantity}` })
      .where(
        "inventory_item_id = :inventoryItemId AND location_id = :locationId",
        { inventoryItemId, locationId }
      )
      .execute()
  }

  /**
   * Deletes inventory levels by inventory Item ID.
   * @param inventoryItemId - The ID or IDs of the inventory item to delete inventory levels for.
   * @param context
   */
  @InjectEntityManager()
  async deleteByInventoryItemId(
    inventoryItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const ids = Array.isArray(inventoryItemId)
      ? inventoryItemId
      : [inventoryItemId]

    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    await levelRepository.softDelete({ inventory_item_id: In(ids) })

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      inventory_item_id: inventoryItemId,
    })
  }

  /**
   * Restores inventory levels by inventory Item ID.
   * @param inventoryItemId - The ID or IDs of the inventory item to restore inventory levels for.
   * @param context
   */
  @InjectEntityManager()
  async restoreByInventoryItemId(
    inventoryItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const ids = Array.isArray(inventoryItemId)
      ? inventoryItemId
      : [inventoryItemId]

    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    await levelRepository.restore({ inventory_item_id: In(ids) })

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.RESTORED, {
      inventory_item_id: inventoryItemId,
    })
  }

  /**
   * Deletes an inventory level by ID.
   * @param inventoryLevelId - The ID or IDs of the inventory level to delete.
   * @param context
   */
  @InjectEntityManager()
  async delete(
    inventoryLevelId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const ids = Array.isArray(inventoryLevelId)
      ? inventoryLevelId
      : [inventoryLevelId]

    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    await levelRepository.softDelete({ id: In(ids) })

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      ids: inventoryLevelId,
    })
  }

  /**
   * Deletes inventory levels by location ID.
   * @param locationId - The ID of the location to delete inventory levels for.
   * @param context
   */
  @InjectEntityManager()
  async deleteByLocationId(
    locationId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    const ids = Array.isArray(locationId) ? locationId : [locationId]

    await levelRepository.softDelete({ location_id: In(ids) })

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
    @MedusaContext() context: SharedContext = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    const manager = context.transactionManager ?? this.manager_
    const levelRepository = manager.getRepository(InventoryLevel)

    const result = await levelRepository
      .createQueryBuilder()
      .select("SUM(stocked_quantity)", "quantity")
      .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return parseFloat(result.quantity)
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    const manager = context.transactionManager ?? this.manager_
    const levelRepository = manager.getRepository(InventoryLevel)

    const result = await levelRepository
      .createQueryBuilder()
      .select("SUM(stocked_quantity - reserved_quantity)", "quantity")
      .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return parseFloat(result.quantity)
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    const manager = context.transactionManager ?? this.manager_
    const levelRepository = manager.getRepository(InventoryLevel)

    const result = await levelRepository
      .createQueryBuilder()
      .select("SUM(reserved_quantity)", "quantity")
      .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return parseFloat(result.quantity)
  }
}
