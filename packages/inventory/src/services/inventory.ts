import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  CreateInventoryItemInput,
  CreateInventoryLevelInput,
  CreateReservationItemInput,
  FilterableInventoryItemProps,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  FindConfig,
  IInventoryService,
  InventoryItemDTO,
  InventoryLevelDTO,
  ReservationItemDTO,
  SharedContext,
  UpdateInventoryLevelInput,
  UpdateReservationItemInput,
} from "@medusajs/types"
import {
  InjectEntityManager,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import { EntityManager } from "typeorm"
import InventoryItemService from "./inventory-item"
import InventoryLevelService from "./inventory-level"
import ReservationItemService from "./reservation-item"

type InjectedDependencies = {
  manager: EntityManager
  inventoryItemService: InventoryItemService
  inventoryLevelService: InventoryLevelService
  reservationItemService: ReservationItemService
}
export default class InventoryService implements IInventoryService {
  protected readonly manager_: EntityManager

  protected readonly inventoryItemService_: InventoryItemService
  protected readonly reservationItemService_: ReservationItemService
  protected readonly inventoryLevelService_: InventoryLevelService

  constructor(
    {
      manager,
      inventoryItemService,
      inventoryLevelService,
      reservationItemService,
    }: InjectedDependencies,
    options?: unknown,
    moduleDeclaration?: InternalModuleDeclaration
  ) {
    this.manager_ = manager
    this.inventoryItemService_ = inventoryItemService
    this.inventoryLevelService_ = inventoryLevelService
    this.reservationItemService_ = reservationItemService
  }

  /**
   * Lists inventory items that match the given selector
   * @param selector - the selector to filter inventory items by
   * @param config - the find configuration to use
   * @return A tuple of inventory items and their total count
   */
  @InjectEntityManager()
  async listInventoryItems(
    selector: FilterableInventoryItemProps,
    config: FindConfig<InventoryItemDTO> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[InventoryItemDTO[], number]> {
    return await this.inventoryItemService_.listAndCount(
      selector,
      config,
      context
    )
  }

  /**
   * Lists inventory levels that match the given selector
   * @param selector - the selector to filter inventory levels by
   * @param config - the find configuration to use
   * @return A tuple of inventory levels and their total count
   */
  @InjectEntityManager()
  async listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config: FindConfig<InventoryLevelDTO> = {
      relations: [],
      skip: 0,
      take: 10,
    },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[InventoryLevelDTO[], number]> {
    return await this.inventoryLevelService_.listAndCount(
      selector,
      config,
      context
    )
  }

  /**
   * Lists reservation items that match the given selector
   * @param selector - the selector to filter reservation items by
   * @param config - the find configuration to use
   * @return A tuple of reservation items and their total count
   */
  @InjectEntityManager()
  async listReservationItems(
    selector: FilterableReservationItemProps,
    config: FindConfig<ReservationItemDTO> = {
      relations: [],
      skip: 0,
      take: 10,
    },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[ReservationItemDTO[], number]> {
    return await this.reservationItemService_.listAndCount(
      selector,
      config,
      context
    )
  }

  /**
   * Retrieves an inventory item with the given id
   * @param inventoryItemId - the id of the inventory item to retrieve
   * @param config - the find configuration to use
   * @return The retrieved inventory item
   */
  @InjectEntityManager()
  async retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_.retrieve(
      inventoryItemId,
      config,
      context
    )
    return { ...inventoryItem }
  }

  /**
   * Retrieves an inventory level for a given inventory item and location
   * @param inventoryItemId - the id of the inventory item
   * @param locationId - the id of the location
   * @return the retrieved inventory level
   */
  @InjectEntityManager()
  async retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context: SharedContext = {}
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
    return inventoryLevel
  }

  /**
   * Retrieves a reservation item
   * @param inventoryItemId - the id of the reservation item
   * @return the retrieved reservation level
   */
  @InjectEntityManager()
  async retrieveReservationItem(
    reservationId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItemDTO> {
    return await this.reservationItemService_.retrieve(
      reservationId,
      undefined,
      context
    )
  }

  /**
   * Creates a reservation item
   * @param input - the input object
   * @return The created reservation item
   */
  @InjectEntityManager()
  async createReservationItem(
    input: CreateReservationItemInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItemDTO> {
    // Verify that the item is stocked at the location
    const [inventoryLevel] = await this.inventoryLevelService_.list(
      {
        inventory_item_id: input.inventory_item_id,
        location_id: input.location_id,
      },
      { take: 1 },
      context
    )

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Item ${input.inventory_item_id} is not stocked at location ${input.location_id}`
      )
    }

    const reservationItem = await this.reservationItemService_.create(
      input,
      context
    )

    return { ...reservationItem }
  }

  /**
   * Creates an inventory item
   * @param input - the input object
   * @return The created inventory item
   */
  @InjectEntityManager()
  async createInventoryItem(
    input: CreateInventoryItemInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_.create(
      input,
      context
    )
    return { ...inventoryItem }
  }

  /**
   * Creates an inventory item
   * @param input - the input object
   * @return The created inventory level
   */
  @InjectEntityManager()
  async createInventoryLevel(
    input: CreateInventoryLevelInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryLevelDTO> {
    return await this.inventoryLevelService_.create(input, context)
  }

  /**
   * Updates an inventory item
   * @param inventoryItemId - the id of the inventory item to update
   * @param input - the input object
   * @return The updated inventory item
   */
  @InjectEntityManager()
  async updateInventoryItem(
    inventoryItemId: string,
    input: Partial<CreateInventoryItemInput>,
    @MedusaContext() context: SharedContext = {}
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_.update(
      inventoryItemId,
      input,
      context
    )
    return { ...inventoryItem }
  }

  /**
   * Deletes an inventory item
   * @param inventoryItemId - the id of the inventory item to delete
   */
  @InjectEntityManager()
  async deleteInventoryItem(
    inventoryItemId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    await this.inventoryLevelService_.deleteByInventoryItemId(
      inventoryItemId,
      context
    )

    return await this.inventoryItemService_.delete(inventoryItemId, context)
  }

  @InjectEntityManager()
  async deleteInventoryItemLevelByLocationId(
    locationId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    return await this.inventoryLevelService_.deleteByLocationId(
      locationId,
      context
    )
  }

  @InjectEntityManager()
  async deleteReservationItemByLocationId(
    locationId: string,
    @MedusaContext() context: SharedContext = {}
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
   */
  @InjectEntityManager()
  async deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context: SharedContext = {}
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

  /**
   * Updates an inventory level
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param locationId - the id of the location associated with the level
   * @param input - the input object
   * @return The updated inventory level
   */
  @InjectEntityManager()
  async updateInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    input: UpdateInventoryLevelInput,
    @MedusaContext() context: SharedContext = {}
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

    return await this.inventoryLevelService_.update(
      inventoryLevel.id,
      input,
      context
    )
  }

  /**
   * Updates a reservation item
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param input - the input object
   * @return The updated inventory level
   */
  @InjectEntityManager()
  async updateReservationItem(
    reservationItemId: string,
    input: UpdateReservationItemInput,
    @MedusaContext() context: SharedContext = {}
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
   */
  @InjectEntityManager()
  async deleteReservationItemsByLineItem(
    lineItemId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    return await this.reservationItemService_.deleteByLineItem(
      lineItemId,
      context
    )
  }

  /**
   * Deletes a reservation item
   * @param reservationItemId - the id of the reservation item to delete
   */
  @InjectEntityManager()
  async deleteReservationItem(
    reservationItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    return await this.reservationItemService_.delete(reservationItemId, context)
  }

  /**
   * Adjusts the inventory level for a given inventory item and location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationId - the id of the location
   * @param adjustment - the number to adjust the inventory by (can be positive or negative)
   * @return The updated inventory level
   * @throws when the inventory level is not found
   */
  @InjectEntityManager()
  async adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    @MedusaContext() context: SharedContext = {}
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
        stocked_quantity: inventoryLevel.stocked_quantity + adjustment,
      },
      context
    )

    return { ...updatedInventoryLevel }
  }

  /**
   * Retrieves the available quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @return The available quantity
   * @throws when the inventory item is not found
   */
  @InjectEntityManager()
  async retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: SharedContext = {}
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
   * @return The stocked quantity
   * @throws when the inventory item is not found
   */
  @InjectEntityManager()
  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: SharedContext = {}
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
   * @return The reserved quantity
   * @throws when the inventory item is not found
   */
  @InjectEntityManager()
  async retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: SharedContext = {}
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
   * @return Whether there is sufficient inventory
   */
  @InjectEntityManager()
  async confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    @MedusaContext() context: SharedContext = {}
  ): Promise<boolean> {
    const availableQuantity = await this.retrieveAvailableQuantity(
      inventoryItemId,
      locationIds,
      context
    )
    return availableQuantity >= quantity
  }
}
