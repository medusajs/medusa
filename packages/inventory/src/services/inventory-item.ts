import {
  CreateInventoryItemInput,
  DAL,
  FilterableInventoryItemProps,
  FindConfig,
  IEventBusService,
  InventoryItemDTO,
  Context,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  isDefined,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { InventoryItem } from "../models"
import { InventoryItemRepository } from "../repositories"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  eventBusService: IEventBusService
  inventoryItemRepository: InventoryItemRepository
}

export default class InventoryItemService {
  static Events = {
    CREATED: "inventory-item.created",
    UPDATED: "inventory-item.updated",
    DELETED: "inventory-item.deleted",
  }

  protected readonly eventBusService_: IEventBusService | undefined
  protected readonly inventoryItemRepository_: InventoryItemRepository

  constructor({
    eventBusService,
    inventoryItemRepository,
  }: InjectedDependencies) {
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
    context?: Context
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
    context?: Context
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
    context?: Context
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
  @InjectTransactionManager(doNotForceTransaction, "inventoryItemRepository_")
  async create(
    data: CreateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryItem[]> {
    return await this.inventoryItemRepository_.create(data, {
      transactionManager: context.transactionManager,
    })
  }

  /**
   * @param inventoryItemId - The id of the inventory item to update.
   * @param data
   * @param context
   * @param context
   * @return The updated inventory item.
   */
  @InjectTransactionManager(doNotForceTransaction, "inventoryItemRepository_")
  async update(
    inventoryItemId: string,
    data: Omit<
      Partial<InventoryItem>,
      "id" | "created_at" | "metadata" | "deleted_at" | "updated_at"
    >,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryItem> {
    const item = await this.retrieve(inventoryItemId, undefined, context)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (shouldUpdate) {
      await this.inventoryItemRepository_.update([{ item, update: data }], {
        transactionManager: context.transactionManager,
      })

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
  @InjectTransactionManager(doNotForceTransaction, "inventoryItemRepository_")
  async delete(
    inventoryItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const ids = Array.isArray(inventoryItemId)
      ? inventoryItemId
      : [inventoryItemId]

    await this.inventoryItemRepository_.softDelete(ids, {
      transactionManager: context.transactionManager,
    })
  }
}
