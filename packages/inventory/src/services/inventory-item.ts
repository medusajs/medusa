import { ILike, In, getConnection, DeepPartial, EntityManager } from "typeorm"
import { isDefined, MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  IEventBusService,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
} from "@medusajs/medusa"

import { InventoryItem } from "../models"
import { CONNECTION_NAME } from "../config"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryItemService {
  static Events = {
    CREATED: "inventory-item.created",
    UPDATED: "inventory-item.updated",
    DELETED: "inventory-item.deleted",
  }

  protected readonly eventBusService_: IEventBusService

  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
  }

  private getManager(): EntityManager {
    const connection = getConnection(CONNECTION_NAME)
    return connection.manager
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @return Resolves to the list of inventory items that match the filter.
   */
  async list(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<InventoryItem[]> {
    const queryBuilder = this.getListQuery(selector, config)
    return await queryBuilder.getMany()
  }

  private getListQuery(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ) {
    const manager = this.getManager()
    const inventoryItemRepository = manager.getRepository(InventoryItem)
    const query = buildQuery(selector, config)

    const queryBuilder = inventoryItemRepository.createQueryBuilder("inv_item")

    if (query.where.q) {
      query.where.sku = ILike(`%${query.where.q as string}%`)

      delete query.where.q
    }

    if ("location_id" in query.where) {
      const locationIds = Array.isArray(selector.location_id)
        ? selector.location_id
        : [selector.location_id]

      queryBuilder.innerJoin(
        "inventory_level",
        "level",
        "level.inventory_item_id = inv_item.id AND level.location_id IN (:...locationIds)",
        { locationIds }
      )

      delete query.where.location_id
    }

    if (query.take) {
      queryBuilder.take(query.take)
    }

    if (query.skip) {
      queryBuilder.skip(query.skip)
    }

    if (query.where) {
      queryBuilder.where(query.where)
    }

    if (query.select) {
      queryBuilder.select(query.select.map((s) => "inv_item." + s))
    }

    if (query.order) {
      const toSelect: string[] = []
      const parsed = Object.entries(query.order).reduce((acc, [k, v]) => {
        const key = `inv_item.${k}`
        toSelect.push(key)
        acc[key] = v
        return acc
      }, {})
      queryBuilder.addSelect(toSelect)
      queryBuilder.orderBy(parsed)
    }

    return queryBuilder
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @return - Resolves to the list of inventory items that match the filter and the count of all matching items.
   */
  async listAndCount(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryItem[], number]> {
    const queryBuilder = this.getListQuery(selector, config)
    return await queryBuilder.getManyAndCount()
  }

  /**
   * Retrieves an inventory item by its id.
   * @param inventoryItemId - the id of the inventory item to retrieve.
   * @param config - the configuration options for the find operation.
   * @return The retrieved inventory item.
   * @throws If the inventory item id is not defined or if the inventory item is not found.
   */
  async retrieve(
    inventoryItemId: string,
    config: FindConfig<InventoryItem> = {}
  ): Promise<InventoryItem> {
    if (!isDefined(inventoryItemId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"inventoryItemId" must be defined`
      )
    }

    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    const query = buildQuery({ id: inventoryItemId }, config)
    const [inventoryItem] = await itemRepository.find(query)

    if (!inventoryItem) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `InventoryItem with id ${inventoryItemId} was not found`
      )
    }

    return inventoryItem
  }

  /**
   * @param input - Input for creating a new inventory item.
   * @return The newly created inventory item.
   */
  async create(data: CreateInventoryItemInput): Promise<InventoryItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    const inventoryItem = itemRepository.create({
      sku: data.sku,
      origin_country: data.origin_country,
      metadata: data.metadata,
      hs_code: data.hs_code,
      mid_code: data.mid_code,
      material: data.material,
      weight: data.weight,
      length: data.length,
      height: data.height,
      width: data.width,
      requires_shipping: data.requires_shipping,
    })

    const result = await itemRepository.save(inventoryItem)

    await this.eventBusService_.emit(InventoryItemService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  /**
   * @param inventoryItemId - The id of the inventory item to update.
   * @param update - The updates to apply to the inventory item.
   * @return The updated inventory item.
   */
  async update(
    inventoryItemId: string,
    data: Omit<
      DeepPartial<InventoryItem>,
      "id" | "created_at" | "metadata" | "deleted_at"
    >
  ): Promise<InventoryItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    const item = await this.retrieve(inventoryItemId)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (shouldUpdate) {
      itemRepository.merge(item, data)
      await itemRepository.save(item)

      await this.eventBusService_.emit(InventoryItemService.Events.UPDATED, {
        id: item.id,
      })
    }

    return item
  }

  /**
   * @param inventoryItemId - The id of the inventory item to delete.
   */
  async delete(inventoryItemId: string): Promise<void> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    await itemRepository.softRemove({ id: inventoryItemId })

    await this.eventBusService_.emit(InventoryItemService.Events.DELETED, {
      id: inventoryItemId,
    })
  }
}
