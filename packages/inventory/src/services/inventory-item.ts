import {
  CreateInventoryItemInput,
  FilterableInventoryItemProps,
  FindConfig,
  IEventBusService,
  InventoryItemDTO,
  SharedContext,
} from "@medusajs/types"
import {
  buildQuery,
  InjectEntityManager,
  isDefined,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import { DeepPartial, EntityManager, FindManyOptions } from "typeorm"
import { InventoryItem } from "../models"
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
   * @return Resolves to the list of inventory items that match the filter.
   */
  @InjectEntityManager()
  async list(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItemDTO[]> {
    const queryBuilder = getListQuery(
      context.transactionManager!,
      selector,
      config
    )
    return await queryBuilder.getMany()
  }

  /**
   * @param selector - Filter options for inventory items.
   * @param config - Configuration for query.
   * @return - Resolves to the list of inventory items that match the filter and the count of all matching items.
   */
  @InjectEntityManager()
  async listAndCount(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[InventoryItemDTO[], number]> {
    const queryBuilder = getListQuery(
      context.transactionManager!,
      selector,
      config
    )
    return await queryBuilder.getManyAndCount()
  }

  /**
   * Retrieves an inventory item by its id.
   * @param inventoryItemId - the id of the inventory item to retrieve.
   * @param config - the configuration options for the find operation.
   * @return The retrieved inventory item.
   * @throws If the inventory item id is not defined or if the inventory item is not found.
   */
  @InjectEntityManager()
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

    const manager = context.transactionManager!
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
  @InjectEntityManager()
  async create(
    data: CreateInventoryItemInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItem> {
    const manager = context.transactionManager!
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

    await this.eventBusService_?.emit?.(InventoryItemService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  /**
   * @param inventoryItemId - The id of the inventory item to update.
   * @param update - The updates to apply to the inventory item.
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
   */
  @InjectEntityManager()
  async delete(
    inventoryItemId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(InventoryItem)

    await itemRepository.softRemove({ id: inventoryItemId })

    await this.eventBusService_?.emit?.(InventoryItemService.Events.DELETED, {
      id: inventoryItemId,
    })
  }
}
