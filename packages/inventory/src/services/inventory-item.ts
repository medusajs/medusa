import {
  CreateInventoryItemInput,
  FilterableInventoryItemProps,
  FindConfig,
  IEventBusService,
  InventoryItemDTO,
  SharedContext,
} from "@medusajs/types"
import {
  InjectEntityManager,
  MedusaContext,
  MedusaError,
  isDefined,
} from "@medusajs/utils"
import { DeepPartial, EntityManager, FindManyOptions, In } from "typeorm"
import { InventoryItem } from "../models"
import { buildQuery } from "../utils/build-query"
import { getListQuery } from "../utils/query"

type InjectedDependencies = {
  eventBusService: IEventBusService
  manager: EntityManager
}

export default class InventoryItemService {
  static Events = {
    CREATED: "inventory-item.created",
    UPDATED: "inventory-item.updated",
    DELETED: "inventory-item.deleted",
    RESTORED: "inventory-item.restored",
  }

  protected readonly manager_: EntityManager
  protected readonly eventBusService_: IEventBusService | undefined

  constructor({ eventBusService, manager }: InjectedDependencies) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @param context
   * @return Resolves to the list of inventory items that match the filter.
   */
  async list(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItemDTO[]> {
    const queryBuilder = getListQuery(
      context.transactionManager ?? this.manager_,
      selector,
      config
    )
    return await queryBuilder.getMany()
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItem> {
    if (!isDefined(inventoryItemId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"inventoryItemId" must be defined`
      )
    }

    const manager = context.transactionManager ?? this.manager_
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
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @param context
   * @return - Resolves to the list of inventory items that match the filter and the count of all matching items.
   */
  async listAndCount(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[InventoryItemDTO[], number]> {
    const queryBuilder = getListQuery(
      context.transactionManager ?? this.manager_,
      selector,
      config
    )

    return await queryBuilder.getManyAndCount()
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

  /**
   * @param inventoryItemId - The id of the inventory item to restore.
   * @param context
   */
  @InjectEntityManager()
  async restore(
    inventoryItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(InventoryItem)

    const ids = Array.isArray(inventoryItemId)
      ? inventoryItemId
      : [inventoryItemId]

    await itemRepository.restore({ id: In(ids) })

    await this.eventBusService_?.emit?.(InventoryItemService.Events.RESTORED, {
      ids: inventoryItemId,
    })
  }
}
