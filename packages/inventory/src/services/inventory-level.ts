import { getConnection, DeepPartial, EntityManager } from "typeorm"
import { isDefined, MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
  IEventBusService,
  TransactionBaseService,
} from "@medusajs/medusa"

import { InventoryLevel } from "../models"
import { CONNECTION_NAME } from "../config"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryLevelService extends TransactionBaseService {
  static Events = {
    CREATED: "inventory-level.created",
    UPDATED: "inventory-level.updated",
    DELETED: "inventory-level.deleted",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly eventBusService_: IEventBusService

  constructor({ eventBusService }: InjectedDependencies) {
    super(arguments[0])

    this.eventBusService_ = eventBusService
    this.manager_ = this.getManager()
  }

  private getManager(): EntityManager {
    if (this.manager_) {
      return this.transactionManager_ ?? this.manager_
    }

    const connection = getConnection(CONNECTION_NAME)
    return connection.manager
  }

  /**
   * Retrieves a list of inventory levels based on the provided selector and configuration.
   * @param {FilterableInventoryLevelProps} [selector={}] - An object containing filterable properties for inventory levels.
   * @param {FindConfig<InventoryLevel>} [config={ relations: [], skip: 0, take: 10 }] - An object containing configuration options for the query.
   * @returns {Promise<InventoryLevel[]>} A promise that resolves with an array of inventory levels.
   */
  async list(
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 }
  ): Promise<InventoryLevel[]> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config)
    return await levelRepository.find(query)
  }

  /**
   * Retrieves a list of inventory levels and a count based on the provided selector and configuration.
   * @param {FilterableInventoryLevelProps} [selector={}] - An object containing filterable properties for inventory levels.
   * @param {FindConfig<InventoryLevel>} [config={ relations: [], skip: 0, take: 10 }] - An object containing configuration options for the query.
   * @returns {Promise<[InventoryLevel[], number]>} A promise that resolves with an array of inventory levels and a count.
   */
  async listAndCount(
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryLevel[], number]> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config)
    return await levelRepository.findAndCount(query)
  }

  /**
   * Retrieves a single inventory level by its ID.
   * @param {string} inventoryLevelId - The ID of the inventory level to retrieve.
   * @param {FindConfig<InventoryLevel>} [config={}] - An object containing configuration options for the query.
   * @returns {Promise<InventoryLevel>} A promise that resolves with the inventory level.
   * @throws {MedusaError} If the inventory level ID is not defined.
   * @throws {MedusaError} If the inventory level with the given ID was not found.
   */
  async retrieve(
    inventoryLevelId: string,
    config: FindConfig<InventoryLevel> = {}
  ): Promise<InventoryLevel> {
    if (!isDefined(inventoryLevelId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"inventoryLevelId" must be defined`
      )
    }

    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery({ id: inventoryLevelId }, config)
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
   * @param {CreateInventoryLevelInput} data - An object containing the properties for the new inventory level.
   * @returns {Promise<InventoryLevel>} A promise that resolves with the created inventory level.
   */
  async create(data: CreateInventoryLevelInput): Promise<InventoryLevel> {
    const result = await this.atomicPhase_(async (manager) => {
      const levelRepository = manager.getRepository(InventoryLevel)

      const inventoryLevel = levelRepository.create({
        location_id: data.location_id,
        inventory_item_id: data.inventory_item_id,
        stocked_quantity: data.stocked_quantity,
        reserved_quantity: data.reserved_quantity ?? 0,
        incoming_quantity: data.incoming_quantity ?? 0,
      })

      return await levelRepository.save(inventoryLevel)
    })

    await this.eventBusService_.emit(InventoryLevelService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  /**
   * Updates an existing inventory level.
   * @param {string} inventoryLevelId - The ID of the inventory level to update.
   * @param {DeepPartial<InventoryLevel>} data - An object containing the properties to update on the inventory level.
   * @param {boolean} [autoSave=true] - A flag indicating whether to save the changes automatically.
   * @returns {Promise<InventoryLevel>} A promise that resolves with the updated inventory level.
   * @throws {MedusaError} If the inventory level ID is not defined.
   * @throws {MedusaError} If the inventory level with the given ID was not found.
   */
  async update(
    inventoryLevelId: string,
    data: Omit<
      DeepPartial<InventoryLevel>,
      "id" | "created_at" | "metadata" | "deleted_at"
    >
  ): Promise<InventoryLevel> {
    return await this.atomicPhase_(async (manager) => {
      const levelRepository = manager.getRepository(InventoryLevel)

      const item = await this.retrieve(inventoryLevelId)

      const shouldUpdate = Object.keys(data).some((key) => {
        return item[key] !== data[key]
      })

      if (shouldUpdate) {
        levelRepository.merge(item, data)
        await levelRepository.save(item)

        await this.eventBusService_.emit(InventoryLevelService.Events.UPDATED, {
          id: item.id,
        })
      }

      return item
    })
  }

  /**
   * Adjust the reserved quantity for an inventory item at a specific location.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {string} locationId - The ID of the location.
   * @param {number} quantity - The quantity to adjust from the reserved quantity.
   */
  async adjustReservedQuantity(
    inventoryItemId: string,
    locationId: string,
    quantity: number
  ): Promise<void> {
    await this.atomicPhase_(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(InventoryLevel)
        .set({ reserved_quantity: () => `reserved_quantity + ${quantity}` })
        .where(
          "inventory_item_id = :inventoryItemId AND location_id = :locationId",
          { inventoryItemId, locationId }
        )
        .execute()
    })
  }

  /**
   * Deletes an inventory level by ID.
   * @param {string} id - The ID of the inventory level to delete.
   */
  async delete(id: string): Promise<void> {
    await this.atomicPhase_(async (manager) => {
      const levelRepository = manager.getRepository(InventoryLevel)

      await levelRepository.delete({ id })
    })

    await this.eventBusService_.emit(InventoryLevelService.Events.DELETED, {
      id,
    })
  }

  /**
   * Gets the total stocked quantity for a specific inventory item at multiple locations.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {string[]} locationIds - The IDs of the locations.
   * @returns {number} - The total stocked quantity.
   */
  async getStockedQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const result = await levelRepository
      .createQueryBuilder()
      .select("SUM(stocked_quantity)", "quantity")
      .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return result.quantity
  }

  /**
   * Gets the total available quantity for a specific inventory item at multiple locations.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {string[]} locationIds - The IDs of the locations.
   * @returns {number} - The total available quantity.
   */
  async getAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const result = await levelRepository
      .createQueryBuilder()
      .select("SUM(stocked_quantity - reserved_quantity)", "quantity")
      .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return result.quantity
  }

  /**
   * Gets the total reserved quantity for a specific inventory item at multiple locations.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {string[]} locationIds - The IDs of the locations.
   * @returns {number} - The total reserved quantity.
   */
  async getReservedQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const result = await levelRepository
      .createQueryBuilder()
      .select("SUM(reserved_quantity)", "quantity")
      .where("inventory_item_id = :inventoryItemId", { inventoryItemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return result.quantity
  }
}
