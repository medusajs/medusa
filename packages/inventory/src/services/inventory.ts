import { InternalModuleDeclaration } from "@medusajs/modules-sdk"

import {
  CreateInventoryItemInput,
  CreateInventoryLevelInput,
  CreateReservationItemInput,
  FilterableInventoryItemProps,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  FindConfig,
  IEventBusService,
  IInventoryService,
  InventoryItemDTO,
  InventoryLevelDTO,
  ReservationItemDTO,
  TransactionBaseService,
  UpdateInventoryLevelInput,
  UpdateReservationItemInput,
} from "@medusajs/medusa"
import { MedusaError } from "medusa-core-utils"

import {
  InventoryItemService,
  InventoryLevelService,
  ReservationItemService,
} from "./"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: IEventBusService
  inventoryItemService: InventoryItemService
  inventoryLevelService: InventoryLevelService
  reservationItemService: ReservationItemService
}
export default class InventoryService
  extends TransactionBaseService
  implements IInventoryService
{
  protected readonly eventBusService_: IEventBusService
  protected readonly inventoryItemService_: InventoryItemService
  protected readonly reservationItemService_: ReservationItemService
  protected readonly inventoryLevelService_: InventoryLevelService

  constructor(
    {
      eventBusService,
      manager,
      inventoryItemService,
      inventoryLevelService,
      reservationItemService,
    }: InjectedDependencies,
    options?: unknown,
    moduleDeclaration?: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.eventBusService_ = eventBusService
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
  async listInventoryItems(
    selector: FilterableInventoryItemProps,
    config: FindConfig<InventoryItemDTO> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryItemDTO[], number]> {
    return await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .listAndCount(selector, config)
  }

  /**
   * Lists inventory levels that match the given selector
   * @param selector - the selector to filter inventory levels by
   * @param config - the find configuration to use
   * @return A tuple of inventory levels and their total count
   */
  async listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config: FindConfig<InventoryLevelDTO> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryLevelDTO[], number]> {
    return await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .listAndCount(selector, config)
  }

  /**
   * Lists reservation items that match the given selector
   * @param selector - the selector to filter reservation items by
   * @param config - the find configuration to use
   * @return A tuple of reservation items and their total count
   */
  async listReservationItems(
    selector: FilterableReservationItemProps,
    config: FindConfig<ReservationItemDTO> = {
      relations: [],
      skip: 0,
      take: 10,
    }
  ): Promise<[ReservationItemDTO[], number]> {
    return await this.reservationItemService_
      .withTransaction(this.activeManager_)
      .listAndCount(selector, config)
  }

  /**
   * Retrieves an inventory item with the given id
   * @param inventoryItemId - the id of the inventory item to retrieve
   * @param config - the find configuration to use
   * @return The retrieved inventory item
   */
  async retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .retrieve(inventoryItemId, config)
    return { ...inventoryItem }
  }

  /**
   * Retrieves an inventory level for a given inventory item and location
   * @param inventoryItemId - the id of the inventory item
   * @param locationId - the id of the location
   * @return the retrieved inventory level
   */
  async retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string
  ): Promise<InventoryLevelDTO> {
    const [inventoryLevel] = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .list(
        { inventory_item_id: inventoryItemId, location_id: locationId },
        { take: 1 }
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
   * Creates a reservation item
   * @param input - the input object
   * @return The created reservation item
   */
  async createReservationItem(
    input: CreateReservationItemInput
  ): Promise<ReservationItemDTO> {
    // Verify that the item is stocked at the location
    const [inventoryLevel] = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .list(
        {
          inventory_item_id: input.inventory_item_id,
          location_id: input.location_id,
        },
        { take: 1 }
      )

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Item ${input.inventory_item_id} is not stocked at location ${input.location_id}`
      )
    }

    const reservationItem = await this.reservationItemService_
      .withTransaction(this.activeManager_)
      .create(input)

    return { ...reservationItem }
  }

  /**
   * Creates an inventory item
   * @param input - the input object
   * @return The created inventory item
   */
  async createInventoryItem(
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .create(input)
    return { ...inventoryItem }
  }

  /**
   * Creates an inventory item
   * @param input - the input object
   * @return The created inventory level
   */
  async createInventoryLevel(
    input: CreateInventoryLevelInput
  ): Promise<InventoryLevelDTO> {
    return await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .create(input)
  }

  /**
   * Updates an inventory item
   * @param inventoryItemId - the id of the inventory item to update
   * @param input - the input object
   * @return The updated inventory item
   */
  async updateInventoryItem(
    inventoryItemId: string,
    input: Partial<CreateInventoryItemInput>
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .update(inventoryItemId, input)
    return { ...inventoryItem }
  }

  /**
   * Deletes an inventory item
   * @param inventoryItemId - the id of the inventory item to delete
   */
  async deleteInventoryItem(inventoryItemId: string): Promise<void> {
    await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .deleteByInventoryItemId(inventoryItemId)

    return await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .delete(inventoryItemId)
  }

  async deleteInventoryItemLevelByLocationId(locationId: string): Promise<void> {
    return await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .deleteByLocationId(locationId)
  }

  async deleteReservationItemByLocationId(locationId: string): Promise<void> {
    return await this.reservationItemService_
      .withTransaction(this.activeManager_)
      .deleteByLocationId(locationId)
  }

  /**
   * Deletes an inventory level
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param locationId - the id of the location associated with the level
   */
  async deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string
  ): Promise<void> {
    const [inventoryLevel] = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .list(
        { inventory_item_id: inventoryItemId, location_id: locationId },
        { take: 1 }
      )

    if (!inventoryLevel) {
      return
    }

    return await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .delete(inventoryLevel.id)
  }

  /**
   * Updates an inventory level
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param locationId - the id of the location associated with the level
   * @param input - the input object
   * @return The updated inventory level
   */
  async updateInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    input: UpdateInventoryLevelInput
  ): Promise<InventoryLevelDTO> {
    const [inventoryLevel] = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .list(
        { inventory_item_id: inventoryItemId, location_id: locationId },
        { take: 1 }
      )

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for item ${inventoryItemId} and location ${locationId} not found`
      )
    }

    return await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .update(inventoryLevel.id, input)
  }

  /**
   * Updates a reservation item
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param input - the input object
   * @return The updated inventory level
   */
  async updateReservationItem(
    reservationItemId: string,
    input: UpdateReservationItemInput
  ): Promise<ReservationItemDTO> {
    return await this.reservationItemService_
      .withTransaction(this.activeManager_)
      .update(reservationItemId, input)
  }

  /**
   * Deletes reservation items by line item
   * @param lineItemId - the id of the line item associated with the reservation item
   */
  async deleteReservationItemsByLineItem(lineItemId: string): Promise<void> {
    return await this.reservationItemService_
      .withTransaction(this.activeManager_)
      .deleteByLineItem(lineItemId)
  }

  /**
   * Deletes a reservation item
   * @param reservationItemId - the id of the reservation item to delete
   */
  async deleteReservationItem(reservationItemId: string): Promise<void> {
    return await this.reservationItemService_
      .withTransaction(this.activeManager_)
      .delete(reservationItemId)
  }

  /**
   * Adjusts the inventory level for a given inventory item and location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationId - the id of the location
   * @param adjustment - the number to adjust the inventory by (can be positive or negative)
   * @return The updated inventory level
   * @throws when the inventory level is not found
   */
  async adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number
  ): Promise<InventoryLevelDTO> {
    const [inventoryLevel] = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .list(
        { inventory_item_id: inventoryItemId, location_id: locationId },
        { take: 1 }
      )
    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for inventory item ${inventoryItemId} and location ${locationId} not found`
      )
    }

    const updatedInventoryLevel = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .update(inventoryLevel.id, {
        stocked_quantity: inventoryLevel.stocked_quantity + adjustment,
      })

    return { ...updatedInventoryLevel }
  }

  /**
   * Retrieves the available quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @return The available quantity
   * @throws when the inventory item is not found
   */
  async retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number> {
    // Throws if item does not exist
    await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .retrieve(inventoryItemId, {
        select: ["id"],
      })

    const availableQuantity = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .getAvailableQuantity(inventoryItemId, locationIds)

    return availableQuantity
  }

  /**
   * Retrieves the stocked quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @return The stocked quantity
   * @throws when the inventory item is not found
   */
  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number> {
    // Throws if item does not exist
    await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .retrieve(inventoryItemId, {
        select: ["id"],
      })

    const stockedQuantity = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .getStockedQuantity(inventoryItemId, locationIds)

    return stockedQuantity
  }

  /**
   * Retrieves the reserved quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @return The reserved quantity
   * @throws when the inventory item is not found
   */
  async retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number> {
    // Throws if item does not exist
    await this.inventoryItemService_
      .withTransaction(this.activeManager_)
      .retrieve(inventoryItemId, {
        select: ["id"],
      })

    const reservedQuantity = await this.inventoryLevelService_
      .withTransaction(this.activeManager_)
      .getReservedQuantity(inventoryItemId, locationIds)

    return reservedQuantity
  }

  /**
   * Confirms whether there is sufficient inventory for a given quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param quantity - the quantity to check
   * @return Whether there is sufficient inventory
   */
  async confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number
  ): Promise<boolean> {
    const availableQuantity = await this.retrieveAvailableQuantity(
      inventoryItemId,
      locationIds
    )
    return availableQuantity >= quantity
  }
}
