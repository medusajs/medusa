import {
  CreateInventoryItemInput,
  DAL,
  FilterableInventoryItemProps,
  FindConfig,
  IEventBusService,
  InventoryItemDTO,
  SharedContext,
} from "@medusajs/types"
import {
  InjectEntityManager,
  isDefined,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { DeepPartial, EntityManager, FindManyOptions, In } from "typeorm"
import { InventoryItem } from "../models"
import { getListQuery } from "../utils/query"
import { buildQuery } from "../utils/build-query"
import { InventoryItemRepository } from "../repositories"

type InjectedDependencies = {
  eventBusService: IEventBusService
  manager: EntityManager
  inventoryItemRepository: InventoryItemRepository
}

export default class InventoryItemService {
  static Events = {
    CREATED: "inventory-item.created",
    UPDATED: "inventory-item.updated",
    DELETED: "inventory-item.deleted",
  }

  protected readonly manager_: EntityManager
  protected readonly eventBusService_: IEventBusService | undefined
  protected readonly inventoryItemRepository_: InventoryItemRepository

  constructor({
    eventBusService,
    inventoryItemRepository,
    manager,
  }: InjectedDependencies) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
    this.inventoryItemRepository_ = inventoryItemRepository
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @param context
   * @return Resolves to the list of inventory items that match the filter.
   */
  async list(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [] },
    context: SharedContext = {}
  ): Promise<InventoryItemDTO[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<InventoryItem>(
      selector,
      config
    )

    // const queryBuilder = getListQuery(
    //   context.transactionManager ?? this.manager_,
    //   selector,
    //   config
    // )
    return await this.inventoryItemRepository_.find(queryOptions, context)
  }

  /**
   * Retrieves an inventory item by its id.
   * @param inventoryItemId - the id of the inventory item to retrieve.
   * @param config - the configuration options for the find operation.
   * @param context
   * @return The retrieved inventory item.
   * @throws If the inventory item id is not defined or if the inventory item is not found.
   */
  async retrieve(
    inventoryItemId: string,
    config: FindConfig<InventoryItem> = {},
    context: SharedContext = {}
  ): Promise<InventoryItem> {
    if (!isDefined(inventoryItemId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"inventoryItemId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<InventoryItem>(
      {
        id: inventoryItemId,
      },
      config
    )

    const inventoryItem = await this.inventoryItemRepository_.find(
      queryOptions,
      context
    )

    if (!inventoryItem?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `InventoryItem with id ${inventoryItemId} was not found`
      )
    }

    return inventoryItem[0]
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @param context
   * @return - Resolves to the list of inventory items that match the filter and the count of all matching items.
   */
  async listAndCount(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 },
    context: SharedContext = {}
  ): Promise<[InventoryItemDTO[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<InventoryItem>(
      selector,
      config
    )

    return await this.inventoryItemRepository_.findAndCount(
      queryOptions,
      context
    )
  }

  /**
   * @param data
   * @param context
   * @param data
   * @param context
   */
  @InjectEntityManager()
  async create(
    data: CreateInventoryItemInput[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItem[]> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(InventoryItem)

    const inventoryItem = itemRepository.create(
      data.map((tc) => ({
        sku: tc.sku,
        origin_country: tc.origin_country,
        metadata: tc.metadata,
        hs_code: tc.hs_code,
        mid_code: tc.mid_code,
        material: tc.material,
        weight: tc.weight,
        length: tc.length,
        height: tc.height,
        width: tc.width,
        requires_shipping: tc.requires_shipping,
        description: tc.description,
        thumbnail: tc.thumbnail,
        title: tc.title,
      }))
    )

    const result = await itemRepository.save(inventoryItem)

    await this.eventBusService_?.emit?.(InventoryItemService.Events.CREATED, {
      ids: result.map((i) => i.id),
    })

    return result
  }

  /**
   * @param inventoryItemId - The id of the inventory item to update.
   * @param data
   * @param context
   * @param context
   * @return The updated inventory item.
   */
  @InjectEntityManager()
  async update(
    inventoryItemId: string,
    data: Omit<
      DeepPartial<InventoryItem>,
      "id" | "created_at" | "metadata" | "deleted_at"
    >,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItem> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(InventoryItem)

    const item = await this.retrieve(inventoryItemId, undefined, context)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (shouldUpdate) {
      itemRepository.merge(item, data)
      await itemRepository.save(item)

      await this.eventBusService_?.emit?.(InventoryItemService.Events.UPDATED, {
        id: item.id,
      })
    }

    return item
  }

  /**
   * @param inventoryItemId - The id of the inventory item to delete.
   * @param context
   */
  @InjectEntityManager()
  async delete(
    inventoryItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(InventoryItem)

    const ids = Array.isArray(inventoryItemId)
      ? inventoryItemId
      : [inventoryItemId]

    await itemRepository.softDelete({ id: In(ids) })

    await this.eventBusService_?.emit?.(InventoryItemService.Events.DELETED, {
      ids: inventoryItemId,
    })
  }
}
