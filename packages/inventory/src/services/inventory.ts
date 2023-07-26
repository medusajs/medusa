import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  BulkUpdateInventoryLevelInput,
  Context,
  CreateInventoryItemInput,
  CreateInventoryLevelInput,
  CreateReservationItemInput,
  DAL,
  FilterableInventoryItemProps,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  FindConfig,
  IInventoryService,
  InventoryItemDTO,
  InventoryLevelDTO,
  JoinerServiceConfig,
  MODULE_RESOURCE_TYPE,
  ReservationItemDTO,
  UpdateInventoryLevelInput,
  UpdateReservationItemInput,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import { joinerConfig } from "../joiner-config"
import InventoryItemService from "./inventory-item"
import InventoryLevelService from "./inventory-level"
import ReservationItemService from "./reservation-item"
import { shouldForceTransaction } from "../utils"
import { InventoryItem, InventoryLevel } from "../models"

type InjectedDependencies = {
  manager: any
  inventoryItemService: InventoryItemService
  inventoryLevelService: InventoryLevelService
  reservationItemService: ReservationItemService
  baseRepository: DAL.RepositoryService
}

export default class InventoryService implements IInventoryService {
  protected readonly manager_: any
  protected baseRepository_: DAL.RepositoryService

  protected readonly inventoryItemService_: InventoryItemService
  protected readonly reservationItemService_: ReservationItemService
  protected readonly inventoryLevelService_: InventoryLevelService

  constructor(
    {
      manager,
      inventoryItemService,
      inventoryLevelService,
      reservationItemService,
      baseRepository,
    }: InjectedDependencies,
    options?: unknown,
    protected readonly moduleDeclaration?: InternalModuleDeclaration
  ) {
    this.manager_ = manager
    this.inventoryItemService_ = inventoryItemService
    this.inventoryLevelService_ = inventoryLevelService
    this.reservationItemService_ = reservationItemService
    this.baseRepository_ = baseRepository
  }

  __joinerConfig(): JoinerServiceConfig {
    return joinerConfig
  }

  /**
   * Lists inventory items that match the given selector
   * @param selector - the selector to filter inventory items by
   * @param config - the find configuration to use
   * @param context
   * @return A tuple of inventory items and their total count
   */
  async listInventoryItems(
    selector: FilterableInventoryItemProps,
    config: FindConfig<InventoryItemDTO> = { relations: [], skip: 0, take: 10 },
    context: Context = {}
  ): Promise<[InventoryItemDTO[], number]> {
    const [items, count] = await this.inventoryItemService_.listAndCount(
      selector,
      config,
      context
    )

    const serialized = await this.baseRepository_.serialize<InventoryItemDTO[]>(
      items
    )

    return [serialized, count]
  }

  async list(
    selector: FilterableInventoryItemProps,
    config: FindConfig<InventoryItemDTO> = { relations: [], skip: 0, take: 10 },
    context: Context = {}
  ): Promise<InventoryItemDTO[]> {
    const items = await this.inventoryItemService_.list(
      selector,
      config,
      context
    )

    const serialized = await this.baseRepository_.serialize<InventoryItemDTO[]>(
      items
    )

    return serialized
  }

  /**
   * Lists inventory levels that match the given selector
   * @param selector - the selector to filter inventory levels by
   * @param config - the find configuration to use
   * @param context
   * @return A tuple of inventory levels and their total count
   */
  async listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config: FindConfig<InventoryLevelDTO> = {
      relations: [],
      skip: 0,
      take: 10,
    },
    context: Context = {}
  ): Promise<[InventoryLevelDTO[], number]> {
    const [levels, count] = await this.inventoryLevelService_.listAndCount(
      selector,
      config,
      context
    )

    const serialized = await this.baseRepository_.serialize<
      InventoryLevelDTO[]
    >(levels)

    return [serialized, count]
  }

  /**
   * Lists reservation items that match the given selector
   * @param selector - the selector to filter reservation items by
   * @param config - the find configuration to use
   * @param context
   * @return A tuple of reservation items and their total count
   */
  async listReservationItems(
    selector: FilterableReservationItemProps,
    config: FindConfig<ReservationItemDTO> = {
      relations: [],
      skip: 0,
      take: 10,
    },
    context: Context = {}
  ): Promise<[ReservationItemDTO[], number]> {
    const [reservations, count] =
      await this.reservationItemService_.listAndCount(selector, config, context)

    const serialized = await this.baseRepository_.serialize<
      ReservationItemDTO[]
    >(reservations)

    return [serialized, count]
  }

  /**
   * Retrieves an inventory item with the given id
   * @param inventoryItemId - the id of the inventory item to retrieve
   * @param config - the find configuration to use
   * @param context
   * @return The retrieved inventory item
   */
  async retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    context: Context = {}
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_.retrieve(
      inventoryItemId,
      config,
      context
    )
    const serialized = await this.baseRepository_.serialize<InventoryItemDTO>(
      inventoryItem,
      {
        populate: true,
      }
    )

    return serialized
  }

  /**
   * Retrieves an inventory level for a given inventory item and location
   * @param inventoryItemId - the id of the inventory item
   * @param locationId - the id of the location
   * @param context
   * @return the retrieved inventory level
   */
  async retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context: Context = {}
  ): Promise<InventoryLevelDTO> {
    const [inventoryLevel] = await this.inventoryLevelService_.list(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      { take: 1 },
      context
    )
    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for item ${inventoryItemId} and location ${locationId} not found`
      )
    }
    const serialized = await this.baseRepository_.serialize<InventoryLevelDTO>(
      inventoryLevel,
      {
        populate: true,
      }
    )

    return serialized
  }

  /**
   * Retrieves a reservation item
   * @param reservationId
   * @param context
   * @param reservationId
   * @param context
   */
  async retrieveReservationItem(
    reservationId: string,
    context: Context = {}
  ): Promise<ReservationItemDTO> {
    const reservation = await this.reservationItemService_.retrieve(
      reservationId,
      undefined,
      context
    )

    const serialized = await this.baseRepository_.serialize<ReservationItemDTO>(
      reservation,
      {
        populate: true,
      }
    )

    return serialized
  }

  private async ensureInventoryLevels(
    data: { location_id: string; inventory_item_id: string }[],
    context: Context = {}
  ): Promise<InventoryLevelDTO[]> {
    const inventoryLevels = await this.inventoryLevelService_.list(
      {
        inventory_item_id: data.map((e) => e.inventory_item_id),
        location_id: data.map((e) => e.location_id),
      },
      {},
      context
    )

    const inventoryLevelMap: Map<
      string,
      Map<string, InventoryLevelDTO>
    > = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    const missing = data.filter(
      (i) => !inventoryLevelMap.get(i.inventory_item_id)?.get(i.location_id)
    )

    if (missing.length) {
      const error = missing
        .map((missing) => {
          return `Item ${missing.inventory_item_id} is not stocked at location ${missing.location_id}`
        })
        .join(", ")
      throw new MedusaError(MedusaError.Types.NOT_FOUND, error)
    }

    return inventoryLevels.map(
      (i) => inventoryLevelMap.get(i.inventory_item_id)!.get(i.location_id)!
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async createReservationItems_(
    input: CreateReservationItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<ReservationItemDTO[]> {
    await this.ensureInventoryLevels(input, context)

    return await this.reservationItemService_.create(input, context)
  }

  async createReservationItems(
    input: CreateReservationItemInput[],
    context: Context = {}
  ): Promise<ReservationItemDTO[]> {
    const reservations = await this.createReservationItems_(input, context)

    const serialized = await this.baseRepository_.serialize<
      ReservationItemDTO[]
    >(reservations, {
      populate: true,
    })

    return serialized
  }
  /**
   * Creates a reservation item
   * @param input - the input object
   * @return The created reservation item
   */

  async createReservationItem(
    input: CreateReservationItemInput,
    context: Context = {}
  ): Promise<ReservationItemDTO> {
    const [reservation] = await this.createReservationItems_([input], context)

    const serialized = await this.baseRepository_.serialize<ReservationItemDTO>(
      reservation,
      {
        populate: true,
      }
    )

    return serialized
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createInventoryItems_(
    input: CreateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryItemDTO[]> {
    return await this.inventoryItemService_.create(input, context)
  }

  async createInventoryItems(
    input: CreateInventoryItemInput[],
    context: Context = {}
  ): Promise<InventoryItemDTO[]> {
    const items = await this.createInventoryItems_(input, context)

    const serialized = await this.baseRepository_.serialize<InventoryItemDTO[]>(
      items,
      {
        populate: true,
      }
    )

    return serialized
  }

  /**
   * Creates an inventory item
   * @param input - the input object
   * @param context
   * @return The created inventory item
   */
  async createInventoryItem(
    input: CreateInventoryItemInput,
    context: Context = {}
  ): Promise<InventoryItemDTO> {
    const [item] = await this.createInventoryItems_([input], context)

    const serialized = await this.baseRepository_.serialize<InventoryItemDTO>(
      item,
      {
        populate: true,
      }
    )

    return serialized
  }

  async createInventoryLevels(
    input: CreateInventoryLevelInput[],
    context: Context = {}
  ): Promise<InventoryLevelDTO[]> {
    const levels = await this.createInventoryLevels_(input, context)

    return this.baseRepository_.serialize(levels, { populate: true })
  }

  /**
   * Creates an inventory item
   * @param input - the input object
   * @param context
   * @return The created inventory level
   */
  async createInventoryLevel(
    input: CreateInventoryLevelInput,
    context: Context = {}
  ): Promise<InventoryLevelDTO> {
    const [result] = await this.createInventoryLevels_([input], context)

    return this.baseRepository_.serialize(result, { populate: true })
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async createInventoryLevels_(
    input: CreateInventoryLevelInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryLevelDTO[]> {
    return await this.inventoryLevelService_.create(input, context)
  }

  /**
   * Updates an inventory item
   * @param inventoryItemId - the id of the inventory item to update
   * @param input - the input object
   * @param context
   * @return The updated inventory item
   */
  async updateInventoryItem(
    inventoryItemId: string,
    input: Partial<CreateInventoryItemInput>,
    context: Context = {}
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.updateInventoryItem_(
      inventoryItemId,
      input,
      context
    )

    const serialized = await this.baseRepository_.serialize<InventoryItemDTO>(
      inventoryItem
    )

    return serialized
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateInventoryItem_(
    inventoryItemId: string,
    input: Partial<CreateInventoryItemInput>,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_.update(
      inventoryItemId,
      input,
      context
    )
    return inventoryItem
  }

  /**
   * Deletes an inventory item
   * @param inventoryItemId - the id of the inventory item to delete
   * @param context
   */
  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteInventoryItem(
    inventoryItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    await this.inventoryLevelService_.deleteByInventoryItemId(
      inventoryItemId,
      context
    )

    return await this.inventoryItemService_.delete(inventoryItemId, context)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteInventoryItemLevelByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.inventoryLevelService_.deleteByLocationId(
      locationId,
      context
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteReservationItemByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.reservationItemService_.deleteByLocationId(
      locationId,
      context
    )
  }

  /**
   * Deletes an inventory level
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param locationId - the id of the location associated with the level
   * @param context
   */
  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const [inventoryLevel] = await this.inventoryLevelService_.list(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      { take: 1 },
      context
    )

    if (!inventoryLevel) {
      return
    }

    return await this.inventoryLevelService_.delete(inventoryLevel.id, context)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async updateInventoryLevels_(
    updates: ({
      inventory_item_id: string
      location_id: string
    } & UpdateInventoryLevelInput)[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryLevelDTO[]> {
    const inventoryLevels = await this.ensureInventoryLevels(updates, context)

    const levelMap = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr.id)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    return await Promise.all(
      updates.map(async (update) => {
        const levelId = levelMap
          .get(update.inventory_item_id)
          .get(update.location_id)

        // TODO make this bulk
        return this.inventoryLevelService_.update(levelId, update, context)
      })
    )
  }

  /**
   * Updates an inventory level
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param locationId - the id of the location associated with the level
   * @param input - the input object
   * @param context
   * @return The updated inventory level
   */
  async updateInventoryLevel(
    inventoryItemId: string,
    locationIdOrContext?: string,
    input?: UpdateInventoryLevelInput,
    context: Context = {}
  ): Promise<InventoryLevelDTO> {
    const updates: BulkUpdateInventoryLevelInput[] = [
      {
        inventory_item_id: inventoryItemId,
        location_id: locationIdOrContext as string,
        ...input,
      },
    ]

    const [level] = await this.updateInventoryLevels_(updates, context)
    const serialized = await this.baseRepository_.serialize<InventoryLevelDTO>(
      level,
      {
        populate: true,
      }
    )

    return serialized
  }

  async updateInventoryLevels(
    updates: ({
      inventory_item_id: string
      location_id: string
    } & UpdateInventoryLevelInput)[],
    context: Context = {}
  ): Promise<InventoryLevelDTO[]> {
    const levels = await this.updateInventoryLevels_(updates, context)

    const serialized = await this.baseRepository_.serialize<
      InventoryLevelDTO[]
    >(levels, {
      populate: true,
    })

    return serialized
  }

  /**
   * Updates a reservation item
   * @param reservationItemId
   * @param input - the input object
   * @param context
   * @param context
   * @return The updated inventory level
   */
  async updateReservationItem(
    reservationItemId: string,
    input: UpdateReservationItemInput,
    context: Context = {}
  ): Promise<ReservationItemDTO> {
    const reservation = await this.updateReservationItem_(
      reservationItemId,
      input,
      context
    )

    const serialized = await this.baseRepository_.serialize<ReservationItemDTO>(
      reservation,
      {
        populate: true,
      }
    )

    return serialized
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateReservationItem_(
    reservationItemId: string,
    input: UpdateReservationItemInput,
    @MedusaContext() context: Context = {}
  ): Promise<ReservationItemDTO> {
    return await this.reservationItemService_.update(
      reservationItemId,
      input,
      context
    )
  }

  /**
   * Deletes reservation items by line item
   * @param lineItemId - the id of the line item associated with the reservation item
   * @param context
   */
  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteReservationItemsByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.reservationItemService_.deleteByLineItem(
      lineItemId,
      context
    )
  }

  /**
   * Deletes a reservation item
   * @param reservationItemId - the id of the reservation item to delete
   * @param context
   */
  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteReservationItem(
    reservationItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.reservationItemService_.delete(reservationItemId, context)
  }

  /**
   * Adjusts the inventory level for a given inventory item and location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationId - the id of the location
   * @param adjustment - the number to adjust the inventory by (can be positive or negative)
   * @param context
   * @return The updated inventory level
   * @throws when the inventory level is not found
   */
  async adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryLevelDTO> {
    const updatedInventoryLevel = await this.adjustInventory_(
      inventoryItemId,
      locationId,
      adjustment,
      context
    )

    const serialized = await this.baseRepository_.serialize<InventoryLevelDTO>(
      updatedInventoryLevel,
      {
        populate: true,
      }
    )

    return serialized
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async adjustInventory_(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryLevelDTO> {
    const [inventoryLevel] = await this.inventoryLevelService_.list(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      { take: 1 },
      context
    )
    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for inventory item ${inventoryItemId} and location ${locationId} not found`
      )
    }

    const updatedInventoryLevel = await this.inventoryLevelService_.update(
      inventoryLevel.id,
      {
        stocked_quantity: Number(inventoryLevel.stocked_quantity) + adjustment,
      },
      context
    )

    return updatedInventoryLevel
  }

  /**
   * Retrieves the available quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param context
   * @return The available quantity
   * @throws when the inventory item is not found
   */
  async retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<number> {
    // Throws if item does not exist
    // TODO: context

    await this.inventoryItemService_.retrieve(
      inventoryItemId,
      {
        select: ["id"],
      },
      context
    )

    if (locationIds.length === 0) {
      return 0
    }

    const availableQuantity =
      await this.inventoryLevelService_.getAvailableQuantity(
        inventoryItemId,
        locationIds,
        context
      )

    return availableQuantity
  }

  /**
   * Retrieves the stocked quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param context
   * @return The stocked quantity
   * @throws when the inventory item is not found
   */
  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<number> {
    // Throws if item does not exist
    // TODO: context
    await this.inventoryItemService_.retrieve(
      inventoryItemId,
      {
        select: ["id"],
      },
      context
    )

    if (locationIds.length === 0) {
      return 0
    }

    const stockedQuantity =
      await this.inventoryLevelService_.getStockedQuantity(
        inventoryItemId,
        locationIds,
        context
      )

    return stockedQuantity
  }

  /**
   * Retrieves the reserved quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param context
   * @return The reserved quantity
   * @throws when the inventory item is not found
   */
  async retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context: Context = {}
  ): Promise<number> {
    // Throws if item does not exist
    await this.inventoryItemService_.retrieve(
      inventoryItemId,
      {
        select: ["id"],
      },
      context
    )

    if (locationIds.length === 0) {
      return 0
    }

    const reservedQuantity =
      await this.inventoryLevelService_.getReservedQuantity(
        inventoryItemId,
        locationIds,
        context
      )

    return reservedQuantity
  }

  /**
   * Confirms whether there is sufficient inventory for a given quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param quantity - the quantity to check
   * @param context
   * @return Whether there is sufficient inventory
   */
  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    @MedusaContext() context: Context = {}
  ): Promise<boolean> {
    const availableQuantity = await this.retrieveAvailableQuantity(
      inventoryItemId,
      locationIds,
      context
    )
    return availableQuantity >= quantity
  }
}
