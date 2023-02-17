import { DeepPartial, EntityManager, FindManyOptions } from "typeorm"
import { isDefined, MedusaError } from "medusa-core-utils"
import {
  buildQuery,
  CreateInventoryItemInput,
  FilterableInventoryItemProps,
  FindConfig,
  IEventBusService,
  InventoryItemDTO,
  TransactionBaseService,
} from "@medusajs/medusa"

import { InventoryItem } from "../models"
import { getListQuery } from "../utils/query"

type InjectedDependencies = {
  eventBusService: IEventBusService
  manager: EntityManager
}

export default class InventoryItemService extends TransactionBaseService {
  static Events = {
    CREATED: "inventory-item.created",
    UPDATED: "inventory-item.updated",
    DELETED: "inventory-item.deleted",
  }

  protected readonly eventBusService_: IEventBusService

  constructor({ eventBusService }: InjectedDependencies) {
    super(arguments[0])

    this.eventBusService_ = eventBusService
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @return Resolves to the list of inventory items that match the filter.
   */
  async list(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<InventoryItemDTO[]> {
    const queryBuilder = getListQuery(this.activeManager_, selector, config)
    return await queryBuilder.getMany()
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @return - Resolves to the list of inventory items that match the filter and the count of all matching items.
   */
  async listAndCount(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryItemDTO[], number]> {
    const queryBuilder = getListQuery(this.activeManager_, selector, config)
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

    const manager = this.activeManager_
    const itemRepository = manager.getRepository(InventoryItem)

    const query = buildQuery({ id: inventoryItemId }, config) as FindManyOptions
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
    return await this.atomicPhase_(async (manager) => {
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

      await this.eventBusService_
        .withTransaction(manager)
        .emit(InventoryItemService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
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
    return await this.atomicPhase_(async (manager) => {
      const itemRepository = manager.getRepository(InventoryItem)

      const item = await this.retrieve(inventoryItemId)

      const shouldUpdate = Object.keys(data).some((key) => {
        return item[key] !== data[key]
      })

      if (shouldUpdate) {
        itemRepository.merge(item, data)
        await itemRepository.save(item)

        await this.eventBusService_
          .withTransaction(manager)
          .emit(InventoryItemService.Events.UPDATED, {
            id: item.id,
          })
      }

      return item
    })
  }

  /**
   * @param inventoryItemId - The id of the inventory item to delete.
   */
  async delete(inventoryItemId: string): Promise<void> {
    await this.atomicPhase_(async (manager) => {
      const itemRepository = manager.getRepository(InventoryItem)

      await itemRepository.softRemove({ id: inventoryItemId })

      await this.eventBusService_
        .withTransaction(manager)
        .emit(InventoryItemService.Events.DELETED, {
          id: inventoryItemId,
        })
    })
  }
}
