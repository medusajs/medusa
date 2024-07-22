import { RestoreReturn, SoftDeleteReturn } from "../dal"

import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { BigNumberInput, IBigNumber } from "../totals"
import {
  FilterableInventoryItemProps,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  InventoryItemDTO,
  InventoryLevelDTO,
  ReservationItemDTO,
} from "./common"
import {
  BulkUpdateInventoryLevelInput,
  CreateInventoryItemInput,
  CreateInventoryLevelInput,
  CreateReservationItemInput,
  UpdateInventoryItemInput,
  UpdateReservationItemInput,
} from "./mutations"

/**
 * The main service interface for the Inventory Module.
 */
export interface IInventoryService extends IModuleService {
  /**
   * This method retrieves a paginated list of inventory items based on optional filters and configuration.
   *
   * @param {FilterableInventoryItemProps} selector - The filters to apply on the retrieved inventory items.
   * @param {FindConfig<InventoryItemDTO>} config - The configurations determining how the inventory item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO[]>} The list of inventory items.
   *
   * @example
   * To retrieve a list of inventory items using their IDs:
   *
   * ```ts
   * const inventoryItems = await inventoryModuleService.listInventoryItems({
   *   id: ["iitem_123", "iitem_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the inventory items:
   *
   * ```ts
   * const inventoryItems = await inventoryModuleService.listInventoryItems(
   *   {
   *     id: ["iitem_123", "iitem_321"],
   *   },
   *   {
   *     relations: ["location_levels"],
   *   }
   * )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const inventoryItems = await inventoryModuleService.listInventoryItems(
   *   {
   *     id: ["iitem_123", "iitem_321"],
   *   },
   *   {
   *     relations: ["location_levels"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>,
    context?: Context
  ): Promise<InventoryItemDTO[]>

  /**
   * This method retrieves a paginated list of inventory items along with the total count of available inventory items satisfying the provided filters.
   *
   * @param {FilterableInventoryItemProps} selector - The filters to apply on the retrieved inventory items.
   * @param {FindConfig<InventoryItemDTO>} config - The configurations determining how the inventory item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[InventoryItemDTO[], number]>} The list of inventory items along with their total count.
   *
   * @example
   * To retrieve a list of inventory items using their IDs:
   *
   * ```ts
   * const [inventoryItems, count] =
   *   await inventoryModuleService.listAndCountInventoryItems({
   *     id: ["iitem_123", "iitem_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the inventory items:
   *
   * ```ts
   * const [inventoryItems, count] =
   *   await inventoryModuleService.listAndCountInventoryItems(
   *     {
   *       id: ["iitem_123", "iitem_321"],
   *     },
   *     {
   *       relations: ["location_levels"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [inventoryItems, count] =
   *   await inventoryModuleService.listAndCountInventoryItems(
   *     {
   *       id: ["iitem_123", "iitem_321"],
   *     },
   *     {
   *       relations: ["location_levels"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>,
    context?: Context
  ): Promise<[InventoryItemDTO[], number]>

  /**
   * This method retrieves a paginated list of reservation items based on optional filters and configuration.
   *
   * @param {FilterableReservationItemProps} selector - The filters to apply on the retrieved reservation items.
   * @param {FindConfig<ReservationItemDTO>} config - The configurations determining how the reservation item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a reservation item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO[]>} The list of reservation items.
   *
   * @example
   * To retrieve a list of reservation items using their IDs:
   *
   * ```ts
   * const reservationItems =
   *   await inventoryModuleService.listReservationItems({
   *     id: ["resitem_123", "resitem_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the reservation items:
   *
   * ```ts
   * const reservationItems =
   *   await inventoryModuleService.listReservationItems(
   *     {
   *       id: ["resitem_123", "resitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const reservationItems =
   *   await inventoryModuleService.listReservationItems(
   *     {
   *       id: ["resitem_123", "resitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listReservationItems(
    selector: FilterableReservationItemProps,
    config?: FindConfig<ReservationItemDTO>,
    context?: Context
  ): Promise<ReservationItemDTO[]>

  /**
   * This method retrieves a paginated list of reservation items along with the total count of available reservation items satisfying the provided filters.
   *
   * @param {FilterableReservationItemProps} selector - The filters to apply on the retrieved reservation items.
   * @param {FindConfig<ReservationItemDTO>} config - The configurations determining how the reservation item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a reservation item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ReservationItemDTO[], number]>} The list of reservation items along with their total count.
   *
   * @example
   * To retrieve a list of reservation items using their IDs:
   *
   * ```ts
   * const [reservationItems, count] =
   *   await inventoryModuleService.listAndCountReservationItems({
   *     id: ["resitem_123", "resitem_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the reservation items:
   *
   * ```ts
   * const [reservationItems, count] =
   *   await inventoryModuleService.listAndCountReservationItems(
   *     {
   *       id: ["resitem_123", "resitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [reservationItems, count] =
   *   await inventoryModuleService.listAndCountReservationItems(
   *     {
   *       id: ["resitem_123", "resitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountReservationItems(
    selector: FilterableReservationItemProps,
    config?: FindConfig<ReservationItemDTO>,
    context?: Context
  ): Promise<[ReservationItemDTO[], number]>

  /**
   * This method retrieves a paginated list of inventory levels based on optional filters and configuration.
   *
   * @param {FilterableInventoryLevelProps} selector - The filters to apply on the retrieved inventory levels.
   * @param {FindConfig<InventoryLevelDTO>} config - The configurations determining how the inventory level is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory level.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO[]>} The list of inventory levels.
   *
   * @example
   * To retrieve a list of inventory levels using the IDs of their associated inventory items:
   *
   * ```ts
   * const inventoryLevels =
   *   await inventoryModuleService.listInventoryLevels({
   *     inventory_item_id: ["iitem_123", "iitem_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the inventory levels:
   *
   * ```ts
   * const inventoryLevels =
   *   await inventoryModuleService.listInventoryLevels(
   *     {
   *       inventory_item_id: ["iitem_123", "iitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const inventoryLevels =
   *   await inventoryModuleService.listInventoryLevels(
   *     {
   *       inventory_item_id: ["iitem_123", "iitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>,
    context?: Context
  ): Promise<InventoryLevelDTO[]>

  /**
   * This method retrieves a paginated list of inventory levels along with the total count of available inventory levels satisfying the provided filters.
   *
   * @param {FilterableInventoryLevelProps} selector - The filters to apply on the retrieved inventory levels.
   * @param {FindConfig<InventoryLevelDTO>} config - The configurations determining how the inventory level is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory level.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[InventoryLevelDTO[], number]>} The list of inventory levels along with their total count.
   *
   * @example
   * To retrieve a list of inventory levels using the IDs of their associated inventory items:
   *
   * ```ts
   * const [inventoryLevels, count] =
   *   await inventoryModuleService.listAndCountInventoryLevels(
   *     {
   *       inventory_item_id: ["iitem_123", "iitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   *
   * To specify relations that should be retrieved within the inventory levels:
   *
   * ```ts
   * const [inventoryLevels, count] =
   *   await inventoryModuleService.listAndCountInventoryLevels(
   *     {
   *       inventory_item_id: ["iitem_123", "iitem_321"],
   *     },
   *     {
   *       relations: ["inventory_item"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [inventoryLevels, count] =
   *   await inventoryModuleService.listAndCountInventoryLevels({
   *     inventory_item_id: ["iitem_123", "iitem_321"],
   *   })
   * ```
   */
  listAndCountInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>,
    context?: Context
  ): Promise<[InventoryLevelDTO[], number]>

  /**
   * This method retrieves an inventory item by its ID.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {FindConfig<InventoryItemDTO>} config - The configurations determining how the inventory item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO>} The retrieved inventory item.
   *
   * @example
   * A simple example that retrieves a inventory item by its ID:
   *
   * ```ts
   * const inventoryItem =
   *   await inventoryModuleService.retrieveInventoryItem("iitem_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const inventoryItem = await inventoryModuleService.retrieveInventoryItem(
   *   "iitem_123",
   *   {
   *     relations: ["location_levels"],
   *   }
   * )
   * ```
   */
  retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    context?: Context
  ): Promise<InventoryItemDTO>

  /**
   * This method retrieves an inventory level based on its associated inventory item and location.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {string} locationId - The location's ID.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The retrieved inventory level.
   *
   * @example
   * const inventoryLevel =
   *   await inventoryModuleService.retrieveInventoryLevelByItemAndLocation(
   *     "iitem_123",
   *     "loc_123"
   *   )
   */
  retrieveInventoryLevelByItemAndLocation(
    inventoryItemId: string,
    locationId: string,
    context?: Context
  ): Promise<InventoryLevelDTO>

  /**
   * This method retrieves an inventory level by its ID.
   *
   * @param {string} inventoryLevelId - The inventory level's ID.
   * @param {FindConfig<InventoryLevelDTO>} config - The configurations determining how the inventory level is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory level.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The retrieved inventory level.
   *
   * @example
   * A simple example that retrieves a inventory level by its ID:
   *
   * ```ts
   * const inventoryLevel =
   *   await inventoryModuleService.retrieveInventoryLevel(
   *     "iitem_123"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const inventoryLevel =
   *   await inventoryModuleService.retrieveInventoryLevel(
   *     "iitem_123",
   *     {
   *       relations: ["inventory_item"],
   *     }
   *   )
   * ```
   */
  retrieveInventoryLevel(
    inventoryLevelId: string,
    config?: FindConfig<InventoryLevelDTO>,
    context?: Context
  ): Promise<InventoryLevelDTO>

  /**
   * This method retrieves a reservation item by its ID.
   *
   * @param {string} reservationId - The reservation's ID.
   * @param {FindConfig<ReservationItemDTO>} config - The configurations determining how the reservation item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a reservation item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO>} The retrieved reservation item.
   *
   * @example
   * A simple example that retrieves a reservation item by its ID:
   *
   * ```ts
   * const reservationItem =
   *   await inventoryModuleService.retrieveReservationItem(
   *     "resitem"
   *   )
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const reservationItem =
   *   await inventoryModuleService.retrieveReservationItem(
   *     "resitem",
   *     {
   *       relations: ["inventory_item"],
   *     }
   *   )
   * ```
   */
  retrieveReservationItem(
    reservationId: string,
    config?: FindConfig<ReservationItemDTO>,
    context?: Context
  ): Promise<ReservationItemDTO>

  /**
   * This method creates reservation items.
   *
   * @param {CreateReservationItemInput[]} input - The details of the reservation items to be created.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO[]>} The created reservation items.
   *
   * @example
   * const reservationItems =
   *   await inventoryModuleService.createReservationItems([
   *     {
   *       inventory_item_id: "iitem_123",
   *       location_id: "loc_123",
   *       quantity: 10,
   *     },
   *   ])
   */
  createReservationItems(
    input: CreateReservationItemInput[],
    context?: Context
  ): Promise<ReservationItemDTO[]>

  /**
   * This method creates a reservation item.
   *
   * @param {CreateReservationItemInput} input - The details of the reservation item to be created.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO>} The created reservation item.
   *
   * @example
   * const reservationItem =
   *   await inventoryModuleService.createReservationItems({
   *     inventory_item_id: "iitem_123",
   *     location_id: "loc_123",
   *     quantity: 10,
   *   })
   */
  createReservationItems(
    input: CreateReservationItemInput,
    context?: Context
  ): Promise<ReservationItemDTO>

  /**
   * This method creates inventory items.
   *
   * @param {CreateInventoryItemInput[]} input - The details of the inventory items to be created.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO[]>} The created inventory items.
   *
   * @example
   * const inventoryItems = await inventoryModuleService.createInventoryItems([
   *   {
   *     sku: "SHIRT",
   *   },
   * ])
   */
  createInventoryItems(
    input: CreateInventoryItemInput[],
    context?: Context
  ): Promise<InventoryItemDTO[]>

  /**
   * This method creates an inventory item.
   *
   * @param {CreateInventoryItemInput} input - The details of the inventory item to be created.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO>} The created inventory item.
   *
   * @example
   * const inventoryItem = await inventoryModuleService.createInventoryItems({
   *   sku: "SHIRT",
   * })
   */
  createInventoryItems(
    input: CreateInventoryItemInput,
    context?: Context
  ): Promise<InventoryItemDTO>

  /**
   * This method creates inventory levels.
   *
   * @param {CreateInventoryLevelInput[]} data - The details of the inventory levels to be created.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO[]>} The created inventory levels.
   *
   * @example
   * const inventoryLevels =
   *   await inventoryModuleService.createInventoryLevels([
   *     {
   *       inventory_item_id: "iitem_123",
   *       location_id: "loc_123",
   *       stocked_quantity: 10,
   *     },
   *     {
   *       inventory_item_id: "iitem_321",
   *       location_id: "loc_321",
   *       stocked_quantity: 20,
   *       reserved_quantity: 10,
   *     },
   *   ])
   */
  createInventoryLevels(
    data: CreateInventoryLevelInput[],
    context?: Context
  ): Promise<InventoryLevelDTO[]>

  /**
   * This method creates an inventory level.
   *
   * @param {CreateInventoryLevelInput} data - The details of the inventory level to be created.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The created inventory level.
   *
   * @example
   * const inventoryLevels =
   *   await inventoryModuleService.createInventoryLevels({
   *     inventory_item_id: "iitem_123",
   *     location_id: "loc_123",
   *     stocked_quantity: 10,
   *   })
   */
  createInventoryLevels(
    data: CreateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryLevelDTO>

  /**
   * This method updates existing inventory levels.
   *
   * @param {BulkUpdateInventoryLevelInput[]} updates - The list of The attributes to update in an inventory level. The inventory level is identified by the IDs of its associated inventory item and location.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO[]>} The updated inventory levels.
   *
   * @example
   * const inventoryLevels =
   *   await inventoryModuleService.updateInventoryLevels([
   *     {
   *       inventory_item_id: "iitem_123",
   *       location_id: "loc_123",
   *       id: "ilev_123",
   *       stocked_quantity: 20,
   *     },
   *   ])
   */
  updateInventoryLevels(
    updates: BulkUpdateInventoryLevelInput[],
    context?: Context
  ): Promise<InventoryLevelDTO[]>

  /**
   * This method updates an existing inventory level.
   *
   * @param {BulkUpdateInventoryLevelInput} updates - The attributes to update in an inventory level. The inventory level is identified by the IDs of its associated inventory item and location.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The updated inventory level.
   *
   * @example
   * const inventoryLevel =
   *   await inventoryModuleService.updateInventoryLevels({
   *     inventory_item_id: "iitem_123",
   *     location_id: "loc_123",
   *     stocked_quantity: 20,
   *   })
   */
  updateInventoryLevels(
    updates: BulkUpdateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryLevelDTO>

  /**
   * This method updates an existing inventory item.
   *
   * @param {UpdateInventoryItemInput} input - The attributes to update in the inventory item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO>} The updated inventory item.
   *
   * @example
   * const inventoryItem = await inventoryModuleService.updateInventoryItems({
   *   id: "iitem_123",
   *   title: "Medusa Shirt Inventory",
   * })
   */
  updateInventoryItems(
    input: UpdateInventoryItemInput,
    context?: Context
  ): Promise<InventoryItemDTO>

  /**
   * This method updates existing inventory items.
   *
   * @param {UpdateInventoryItemInput[]} input - The attributes to update in the inventory items.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO[]>} The updated inventory items.
   *
   * @example
   * const inventoryItems = await inventoryModuleService.updateInventoryItems([
   *   {
   *     id: "iitem_123",
   *     title: "Medusa Shirt Inventory",
   *   },
   *   {
   *     id: "iitem_321",
   *     description: "The inventory of Medusa pants",
   *   },
   * ])
   */
  updateInventoryItems(
    input: UpdateInventoryItemInput[],
    context?: Context
  ): Promise<InventoryItemDTO[]>

  /**
   * This method updates an existing reservation item.
   *
   * @param {UpdateReservationItemInput} input - The attributes to update in a reservation item.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO>} The updated reservation item.
   *
   * @example
   * const reservationItem =
   *   await inventoryModuleService.updateReservationItems({
   *     id: "resitem_123",
   *     quantity: 10,
   *   })
   */
  updateReservationItems(
    input: UpdateReservationItemInput,
    context?: Context
  ): Promise<ReservationItemDTO>

  /**
   * This method updates existing reservation items.
   *
   * @param {UpdateReservationItemInput[]} input - The attributes to update in the reservation items.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO[]>} The updated reservation items.
   *
   * @example
   * const reservationItems =
   *   await inventoryModuleService.updateReservationItems([
   *     {
   *       id: "resitem_123",
   *       quantity: 10,
   *     },
   *   ])
   */
  updateReservationItems(
    input: UpdateReservationItemInput[],
    context?: Context
  ): Promise<ReservationItemDTO[]>

  /**
   * This method deletes a reservation item by its associated line item.
   *
   * @param {string | string[]} lineItemId - The line item's ID.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the reservation item is deleted.
   *
   * @example
   * await inventoryModuleService.deleteReservationItemByLocationId(
   *   "cali_123"
   * )
   */
  deleteReservationItemsByLineItem(
    lineItemId: string | string[],
    context?: Context
  ): Promise<void>

  /**
   * This method is used to restore the reservation items associated with a line item or multiple line items that were deleted.
   *
   * @param {string | string[]} lineItemId - The ID(s) of the line item(s).
   * @param {SharedContext} context - A context used to share re9sources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the reservation items are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function restoreReservationItemsByLineItem (
   *   lineItemIds: string[]
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.restoreReservationItemsByLineItem(
   *     lineItemIds
   *   )
   * }
   */
  restoreReservationItemsByLineItem(
    lineItemId: string | string[],
    context?: Context
  ): Promise<void>

  /**
   * This method deletes reservation items by their IDs.
   *
   * @param {string | string[]} reservationItemId - The reservation items' IDs.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the reservation item is deleted.
   *
   * @example
   * await inventoryModuleService.deleteReservationItems(
   *   "resitem_123"
   * )
   */
  deleteReservationItems(
    reservationItemId: string | string[],
    context?: Context
  ): Promise<void>

  /**
   * This method soft deletes reservations by their IDs.
   *
   * @param {string[]} inventoryLevelIds - The reservations' IDs.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await inventoryModuleService.softDeleteReservationItems([
   *   "ilev_123",
   * ])
   */
  softDeleteReservationItems<TReturnableLinkableKeys extends string = string>(
    ReservationItemIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted reservations by their IDs.
   *
   * @param {string[]} ReservationItemIds - The reservations' IDs.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the reservation. You can pass to its `returnLinkableKeys`
   * property any of the reservation's relation attribute names, such as `{type relation name}`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await inventoryModuleService.restoreReservationItems([
   *   "ilev_123",
   * ])
   */
  restoreReservationItems<TReturnableLinkableKeys extends string = string>(
    ReservationItemIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method deletes inventory items by their IDs.
   *
   * @param {string | string[]} inventoryItemId - The inventory item's ID.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the inventory items are deleted.
   *
   * @example
   * await inventoryModuleService.deleteInventoryItems("iitem_123")
   */
  deleteInventoryItems(
    inventoryItemId: string | string[],
    context?: Context
  ): Promise<void>

  /**
   * This method soft deletes inventory items by their IDs.
   *
   * @param {string[]} inventoryItemIds - The inventory items' IDs.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated location levels.
   * The object's keys are the ID attribute names of the inventory service next entity's relations, such as `location_level_id`, and its value is an array of strings, each being the ID of a record associated
   * with the inventory item through this relation, such as the IDs of associated location levels.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await inventoryModuleService.softDeleteInventoryItems(
   *   ["iitem_123", "iitem_321"],
   *   {
   *     returnLinkableKeys: ["location_level"],
   *   }
   * )
   */
  softDeleteInventoryItems<TReturnableLinkableKeys extends string = string>(
    inventoryItemIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted inventory items by their IDs.
   *
   * @param {string[]} inventoryItemIds - The inventory items' IDs.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the inventory items. You can pass to its `returnLinkableKeys`
   * property any of the inventory item's relation attribute names, such as `location_levels`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated location levels.
   * The object's keys are the ID attribute names of the inventory item entity's relations, such as `location_level_id`,
   * and its value is an array of strings, each being the ID of the record associated with the inventory item through this relation,
   * such as the IDs of associated location levels.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await inventoryModuleService.restoreInventoryItems(
   *   ["iitem_123", "iitem_321"],
   *   {
   *     returnLinkableKeys: ["location_level"],
   *   }
   * )
   */
  restoreInventoryItems<TReturnableLinkableKeys extends string = string>(
    inventoryItemIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method soft deletes inventory item's level by the associated location.
   *
   * @param {string | string[]} locationId - The locations' IDs.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[object[], Record<string, unknown[]>]>} An array, where the first item is an array includes the soft-deleted inventory levels,
   * and the second is an object that includes the IDs of related records that were soft-deleted.
   *
   * @example
   * await inventoryModuleService.deleteInventoryItemLevelByLocationId(
   *   "loc_123"
   * )
   */
  deleteInventoryItemLevelByLocationId(
    locationId: string | string[],
    context?: Context
  ): Promise<[object[], Record<string, unknown[]>]>

  /**
   * This method deletes reservation items by their associated location.
   *
   * @param {string | string[]} locationId - The location's ID.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when then reservation items are deleted successfully.
   *
   * @example
   * await inventoryModuleService.deleteReservationItemByLocationId(
   *   "loc_123"
   * )
   */
  deleteReservationItemByLocationId(
    locationId: string | string[],
    context?: Context
  ): Promise<void>

  /**
   * This method deletes an inventory level by its associated inventory item and location.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {string} locationId - The location's ID.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the inventory level is deleted successfully.
   *
   * @example
   * await inventoryModuleService.deleteInventoryLevel(
   *   "iitem_123",
   *   "loc_123"
   * )
   */
  deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context?: Context
  ): Promise<void>

  /**
   * This method deletes inventory levels by their IDs.
   *
   * @param {string | string[]} inventoryLevelIds - The inventory levels' IDs.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the inventory levels are deleted.
   *
   * @example
   * await inventoryModuleService.deleteInventoryLevels("ilev_123")
   */
  deleteInventoryLevels(
    inventoryLevelIds: string | string[],
    context?: Context
  ): Promise<void>

  /**
   * This method soft deletes inventory levels by their IDs.
   *
   * @param {string[]} inventoryLevelIds - The inventory levels' IDs.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await inventoryModuleService.softDeleteInventoryLevels([
   *   "ilev_123",
   * ])
   */
  softDeleteInventoryLevels<TReturnableLinkableKeys extends string = string>(
    inventoryLevelIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted inventory levels by their IDs.
   *
   * @param {string[]} inventoryLevelIds - The inventory levels' IDs.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the inventory level. You can pass to its `returnLinkableKeys`
   * property any of the inventory level's relation attribute names, such as `{type relation name}`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored.
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await inventoryModuleService.restoreInventoryLevels([
   *   "ilev_123",
   * ])
   */
  restoreInventoryLevels<TReturnableLinkableKeys extends string = string>(
    inventoryLevelIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method adjusts the inventory quantity of an item in a location.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {string} locationId - The location's ID.
   * @param {number} adjustment - the adjustment to make to the quantity.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The updated inventory level.
   *
   * @example
   * // add to the inventory quantity
   * const inventoryLevel1 =
   *   await inventoryModuleService.adjustInventory(
   *     "iitem_123",
   *     "loc_123",
   *     5
   *   )
   *
   * // subtract from the inventory quantity
   * const inventoryLevel2 =
   *   await inventoryModuleService.adjustInventory(
   *     "iitem_123",
   *     "loc_123",
   *     -5
   *   )
   */

  adjustInventory(
    data: {
      inventoryItemId: string
      locationId: string
      adjustment: BigNumberInput
    }[],
    context?: Context
  ): Promise<InventoryLevelDTO[]>

  adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: BigNumberInput,
    context?: Context
  ): Promise<InventoryLevelDTO>

  /**
   * This method confirms that a quantity is available of an inventory item in the specified locations.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {string[]} locationIds - The locations' IDs.
   * @param {number} quantity - The quantity to confirm its availability.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<boolean>} Whether the quantity is available.
   *
   * @example
   * const isAvailable =
   *   await inventoryModuleService.confirmInventory(
   *     "iitem_123",
   *     ["loc_123", "loc_321"],
   *     10
   *   )
   */
  confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: BigNumberInput,
    context?: Context
  ): Promise<boolean>

  /**
   * This method retrieves the available quantity of an inventory item in the specified locations.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {string[]} locationIds - The locations' IDs.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<BigNumber>} The available quantity of the item.
   *
   * @example
   * const availableQuantity =
   *   await inventoryModuleService.retrieveAvailableQuantity(
   *     "iitem_123",
   *     ["loc_123", "loc_321"]
   *   )
   */
  retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: Context
  ): Promise<IBigNumber>

  /**
   * This method retrieves the stocked quantity of an inventory item in the specified location.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {string[]} locationIds - The locations' IDs.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<BigNumber>} The stocked quantity of the item.
   *
   * @example
   * const stockedQuantity =
   *   await inventoryModuleService.retrieveStockedQuantity(
   *     "iitem_123",
   *     ["loc_123", "loc_321"]
   *   )
   */
  retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: Context
  ): Promise<IBigNumber>

  /**
   * This method retrieves the reserved quantity of an inventory item in the specified location.
   *
   * @param {string} inventoryItemId - The inventory item's ID.
   * @param {string[]} locationIds - The locations' IDs.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<BigNumber>} The reserved quantity of the item.
   *
   * @example
   * const reservedQuantity =
   *   await inventoryModuleService.retrieveReservedQuantity(
   *     "iitem_123",
   *     ["loc_123", "loc_321"]
   *   )
   */
  retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: Context
  ): Promise<IBigNumber>
}
