import {
  CreateInventoryLevelInput,
  FilterableInventoryLevelProps,
  FindConfig,
  IEventBusService,
  SharedContext,
} from "@medusajs/types"
import {
  buildQuery,
  InjectEntityManager,
  isDefined,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import { DeepPartial, EntityManager, FindManyOptions, In } from "typeorm"
import { InventoryLevel } from "../models"

type InjectedDependencies = {
  eventBusService: IEventBusService
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

  constructor({ eventBusService, manager }: InjectedDependencies) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
  }

  /**
   * Retrieves a list of inventory levels based on the provided selector and configuration.
   * @param selector - An object containing filterable properties for inventory levels.
   * @param config - An object containing configuration options for the query.
   * @return Array of inventory levels.
   */
  @InjectEntityManager()
  async list(
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryLevel[]> {
    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config) as FindManyOptions
    return await levelRepository.find(query)
  }

  /**
   * Retrieves a list of inventory levels and a count based on the provided selector and configuration.
   * @param selector - An object containing filterable properties for inventory levels.
   * @param config - An object containing configuration options for the query.
   * @return An array of inventory levels and a count.
   */
  @InjectEntityManager()
  async listAndCount(
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[InventoryLevel[], number]> {
    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config) as FindManyOptions
    return await levelRepository.findAndCount(query)
  }

  /**
   * Retrieves a single inventory level by its ID.
   * @param inventoryLevelId - The ID of the inventory level to retrieve.
   * @param config - An object containing configuration options for the query.
   * @return A inventory level.
   * @throws If the inventory level ID is not defined or the given ID was not found.
   */
  @InjectEntityManager()
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

    const manager = context.transactionManager!
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
   * @return The created inventory level.
   */
  @InjectEntityManager()
  async create(
    data: CreateInventoryLevelInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryLevel> {
    const manager = context.transactionManager!

    const levelRepository = manager.getRepository(InventoryLevel)

    const inventoryLevel = levelRepository.create({
      location_id: data.location_id,
      inventory_item_id: data.inventory_item_id,
      stocked_quantity: data.stocked_quantity,
      reserved_quantity: data.reserved_quantity,
      incoming_quantity: data.incoming_quantity,
    })

    const saved = await levelRepository.save(inventoryLevel)
    await this.eventBusService_?.emit?.(InventoryLevelService.Events.CREATED, {
      id: saved.id,
    })

    return saved
  }

  /**
   * Updates an existing inventory level.
   * @param inventoryLevelId - The ID of the inventory level to update.
   * @param data - An object containing the properties to update on the inventory level.
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

    await levelRepository.delete({ inventory_item_id: In(ids) })

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      inventory_item_id: inventoryItemId,
    })
  }

  /**
   * Deletes an inventory level by ID.
   * @param inventoryLevelId - The ID or IDs of the inventory level to delete.
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

    await levelRepository.delete({ id: In(ids) })

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      id: inventoryLevelId,
    })
  }

  /**
   * Deletes inventory levels by location ID.
   * @param locationId - The ID of the location to delete inventory levels for.
   */
  @InjectEntityManager()
  async deleteByLocationId(
    locationId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const levelRepository = manager.getRepository(InventoryLevel)

    await levelRepository.delete({ location_id: locationId })

    await this.eventBusService_?.emit?.(InventoryLevelService.Events.DELETED, {
      location_id: locationId,
    })
  }

  /**
   * Gets the total stocked quantity for a specific inventory item at multiple locations.
   * @param inventoryItemId - The ID of the inventory item.
   * @param locationIds - The IDs of the locations.
   * @return The total stocked quantity.
   */
  @InjectEntityManager()
  async getStockedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    const manager = context.transactionManager!
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
   * @return The total available quantity.
   */
  @InjectEntityManager()
  async getAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    const manager = context.transactionManager!
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
   * @return The total reserved quantity.
   */
  @InjectEntityManager()
  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[] | string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<number> {
    if (!Array.isArray(locationIds)) {
      locationIds = [locationIds]
    }

    const manager = context.transactionManager!
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
