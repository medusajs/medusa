import {
  BulkUpdateInventoryLevelInput,
  CreateInventoryItemInput,
  CreateInventoryLevelInput,
  CreateReservationItemInput,
  FilterableInventoryItemProps,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  InventoryItemDTO,
  InventoryLevelDTO,
  ReservationItemDTO,
  UpdateInventoryLevelInput,
  UpdateReservationItemInput,
} from "./common"

import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { SharedContext } from "../shared-context"

/**
 * The main service interface for the inventory module.
 */
export interface IInventoryService extends IModuleService {
  /**
   * This method is used to retrieve a paginated list of inventory items along with the total count of available inventory items satisfying the provided filters.
   * @param {FilterableInventoryItemProps} selector - The filters to apply on the retrieved inventory items.
   * @param {FindConfig<InventoryItemDTO>} config -
   * The configurations determining how the inventory items are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory item.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @return {Promise<[InventoryItemDTO[], number]>} The list of inventory items along with the total count.
   *
   * @example
   * To retrieve a list of inventory items using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryItems (ids: string[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [inventoryItems, count] = await inventoryModule.listInventoryItems({
   *     id: ids
   *   })
   *
   *   // do something with the inventory items or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the inventory items:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryItems (ids: string[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [inventoryItems, count] = await inventoryModule.listInventoryItems({
   *     id: ids
   *   }, {
   *     relations: ["inventory_level"]
   *   })
   *
   *   // do something with the inventory items or return them
   * }
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryItems (ids: string[], skip: number, take: number) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [inventoryItems, count] = await inventoryModule.listInventoryItems({
   *     id: ids
   *   }, {
   *     relations: ["inventory_level"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the inventory items or return them
   * }
   * ```
   */
  listInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>,
    context?: SharedContext
  ): Promise<[InventoryItemDTO[], number]>

  /**
   * This method is used to retrieve a paginated list of reservation items along with the total count of available reservation items satisfying the provided filters.
   * @param {FilterableReservationItemProps} selector - The filters to apply on the retrieved reservation items.
   * @param {FindConfig<ReservationItemDTO>} config -
   * The configurations determining how the reservation items are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a reservation item.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @return {Promise<[ReservationItemDTO[], number]>} The list of reservation items along with the total count.
   *
   * @example
   * To retrieve a list of reservation items using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveReservationItems (ids: string[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [reservationItems, count] = await inventoryModule.listReservationItems({
   *     id: ids
   *   })
   *
   *   // do something with the reservation items or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the reservation items:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveReservationItems (ids: string[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [reservationItems, count] = await inventoryModule.listReservationItems({
   *     id: ids
   *   }, {
   *     relations: ["inventory_item"]
   *   })
   *
   *   // do something with the reservation items or return them
   * }
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveReservationItems (ids: string[], skip: number, take: number) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [reservationItems, count] = await inventoryModule.listReservationItems({
   *     id: ids
   *   }, {
   *     relations: ["inventory_item"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the reservation items or return them
   * }
   * ```
   */
  listReservationItems(
    selector: FilterableReservationItemProps,
    config?: FindConfig<ReservationItemDTO>,
    context?: SharedContext
  ): Promise<[ReservationItemDTO[], number]>

  /**
   * This method is used to retrieve a paginated list of inventory levels along with the total count of available inventory levels satisfying the provided filters.
   * @param {FilterableInventoryLevelProps} selector - The filters to apply on the retrieved inventory levels.
   * @param {FindConfig<InventoryLevelDTO>} config -
   * The configurations determining how the inventory levels are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory level.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @return {Promise<[InventoryLevelDTO[], number]>} The list of inventory levels along with the total count.
   *
   * @example
   * To retrieve a list of inventory levels using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryLevels (inventoryItemIds: string[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [inventoryLevels, count] = await inventoryModule.listInventoryLevels({
   *     inventory_item_id: inventoryItemIds
   *   })
   *
   *   // do something with the inventory levels or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the inventory levels:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryLevels (inventoryItemIds: string[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [inventoryLevels, count] = await inventoryModule.listInventoryLevels({
   *     inventory_item_id: inventoryItemIds
   *   }, {
   *     relations: ["inventory_item"]
   *   })
   *
   *   // do something with the inventory levels or return them
   * }
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryLevels (inventoryItemIds: string[], skip: number, take: number) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const [inventoryLevels, count] = await inventoryModule.listInventoryLevels({
   *     inventory_item_id: inventoryItemIds
   *   }, {
   *     relations: ["inventory_item"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the inventory levels or return them
   * }
   * ```
   */
  listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>,
    context?: SharedContext
  ): Promise<[InventoryLevelDTO[], number]>

  /**
   * This method is used to retrieve an inventory item by its ID
   *
   * @param {string} inventoryItemId - The ID of the inventory item to retrieve.
   * @param {FindConfig<InventoryItemDTO>} config -
   * The configurations determining how the inventory item is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a inventory item.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO>} The retrieved inventory item.
   *
   * @example
   * A simple example that retrieves a inventory item by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryItem (id: string) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryItem = await inventoryModule.retrieveInventoryItem(id)
   *
   *   // do something with the inventory item or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryItem (id: string) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryItem = await inventoryModule.retrieveInventoryItem(id, {
   *     relations: ["inventory_level"]
   *   })
   *
   *   // do something with the inventory item or return it
   * }
   * ```
   */
  retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    context?: SharedContext
  ): Promise<InventoryItemDTO>

  /**
   * This method is used to retrieve an inventory level for an inventory item and a location.
   *
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {string} locationId - The ID of the location.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The retrieved inventory level.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveInventoryLevel (
   *   inventoryItemId: string,
   *   locationId: string
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryLevel = await inventoryModule.retrieveInventoryLevel(
   *     inventoryItemId,
   *     locationId
   *   )
   *
   *   // do something with the inventory level or return it
   * }
   */
  retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  /**
   * This method is used to retrieve a reservation item by its ID.
   *
   * @param {string} reservationId - The ID of the reservation item.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO>} The retrieved reservation item.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveReservationItem (id: string) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const reservationItem = await inventoryModule.retrieveReservationItem(id)
   *
   *   // do something with the reservation item or return it
   * }
   */
  retrieveReservationItem(
    reservationId: string,
    context?: SharedContext
  ): Promise<ReservationItemDTO>

  /**
   * This method is used to create a reservation item.
   *
   * @param {CreateReservationItemInput} input - The details of the reservation item to create.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO>} The created reservation item's details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function createReservationItem (item: {
   *   inventory_item_id: string,
   *   location_id: string,
   *   quantity: number
   * }) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const reservationItem = await inventoryModule.createReservationItems(
   *     item
   *   )
   *
   *   // do something with the reservation item or return them
   * }
   */
  createReservationItem(
    input: CreateReservationItemInput,
    context?: SharedContext
  ): Promise<ReservationItemDTO>

  /**
   * This method is used to create reservation items.
   *
   * @param {CreateReservationItemInput[]} input - The details of the reservation items to create.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns { Promise<ReservationItemDTO[]>} The created reservation items' details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function createReservationItems (items: {
   *   inventory_item_id: string,
   *   location_id: string,
   *   quantity: number
   * }[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const reservationItems = await inventoryModule.createReservationItems(
   *     items
   *   )
   *
   *   // do something with the reservation items or return them
   * }
   */
  createReservationItems(
    input: CreateReservationItemInput[],
    context?: SharedContext
  ): Promise<ReservationItemDTO[]>

  /**
   * This method is used to create an inventory item.
   *
   * @param {CreateInventoryItemInput} input - The details of the inventory item to create.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO>} The created inventory item's details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function createInventoryItem (item: {
   *   sku: string,
   *   requires_shipping: boolean
   * }) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryItem = await inventoryModule.createInventoryItem(
   *     item
   *   )
   *
   *   // do something with the inventory item or return it
   * }
   */
  createInventoryItem(
    input: CreateInventoryItemInput,
    context?: SharedContext
  ): Promise<InventoryItemDTO>

  /**
   * This method is used to create inventory items.
   *
   * @param {CreateInventoryItemInput[]} input - The details of the inventory items to create.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO[]>} The created inventory items' details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function createInventoryItems (items: {
   *   sku: string,
   *   requires_shipping: boolean
   * }[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryItems = await inventoryModule.createInventoryItems(
   *     items
   *   )
   *
   *   // do something with the inventory items or return them
   * }
   */
  createInventoryItems(
    input: CreateInventoryItemInput[],
    context?: SharedContext
  ): Promise<InventoryItemDTO[]>

  /**
   * This method is used to create inventory level.
   *
   * @param {CreateInventoryLevelInput} data - The details of the inventory level to create.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The created inventory level's details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function createInventoryLevel (item: {
   *   inventory_item_id: string
   *   location_id: string
   *   stocked_quantity: number
   * }) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryLevel = await inventoryModule.createInventoryLevel(
   *     item
   *   )
   *
   *   // do something with the inventory level or return it
   * }
   */
  createInventoryLevel(
    data: CreateInventoryLevelInput,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  /**
   * This method is used to create inventory levels.
   *
   * @param {CreateInventoryLevelInput[]} data - The details of the inventory levels to create.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO[]>} The created inventory levels' details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function createInventoryLevels (items: {
   *   inventory_item_id: string
   *   location_id: string
   *   stocked_quantity: number
   * }[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryLevels = await inventoryModule.createInventoryLevels(
   *     items
   *   )
   *
   *   // do something with the inventory levels or return them
   * }
   */
  createInventoryLevels(
    data: CreateInventoryLevelInput[],
    context?: SharedContext
  ): Promise<InventoryLevelDTO[]>

  /**
   * This method is used to update inventory levels. Each inventory level is identified by the IDs of its associated inventory item and location.
   *
   * @param {BulkUpdateInventoryLevelInput} updates - The attributes to update in each inventory level.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO[]>} The updated inventory levels' details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function updateInventoryLevels (items: {
   *   inventory_item_id: string,
   *   location_id: string,
   *   stocked_quantity: number
   * }[]) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryLevels = await inventoryModule.updateInventoryLevels(
   *     items
   *   )
   *
   *   // do something with the inventory levels or return them
   * }
   */
  updateInventoryLevels(
    updates: BulkUpdateInventoryLevelInput[],
    context?: SharedContext
  ): Promise<InventoryLevelDTO[]>

  /**
   * This method is used to update an inventory level. The inventory level is identified by the IDs of its associated inventory item and location.
   *
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {string} locationId - The ID of the location.
   * @param {UpdateInventoryLevelInput} update - The attributes to update in the location level.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The updated inventory level's details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function updateInventoryLevel (
   *   inventoryItemId: string,
   *   locationId: string,
   *   stockedQuantity: number
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryLevel = await inventoryModule.updateInventoryLevels(
   *     inventoryItemId,
   *     locationId,
   *     {
   *       stocked_quantity: stockedQuantity
   *     }
   *   )
   *
   *   // do something with the inventory level or return it
   * }
   */
  updateInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    update: UpdateInventoryLevelInput,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  /**
   * This method is used to update an inventory item.
   *
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {Partial<CreateInventoryItemInput>} input - The attributes to update in the inventory item.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryItemDTO>} The updated inventory item's details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function updateInventoryItem (
   *   inventoryItemId: string,
   *   sku: string
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryItem = await inventoryModule.updateInventoryItem(
   *     inventoryItemId,
   *     {
   *       sku
   *     }
   *   )
   *
   *   // do something with the inventory item or return it
   * }
   */
  updateInventoryItem(
    inventoryItemId: string,
    input: Partial<CreateInventoryItemInput>,
    context?: SharedContext
  ): Promise<InventoryItemDTO>

  /**
   * This method is used to update a reservation item.
   *
   * @param {string} reservationItemId - The ID of the reservation item.
   * @param {UpdateReservationItemInput} input - The attributes to update in the reservation item.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ReservationItemDTO>} The updated reservation item.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function updateReservationItem (
   *   reservationItemId: string,
   *   quantity: number
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const reservationItem = await inventoryModule.updateReservationItem(
   *     reservationItemId,
   *     {
   *       quantity
   *     }
   *   )
   *
   *   // do something with the reservation item or return it
   * }
   */
  updateReservationItem(
    reservationItemId: string,
    input: UpdateReservationItemInput,
    context?: SharedContext
  ): Promise<ReservationItemDTO>

  /**
   * This method is used to delete the reservation items associated with a line item or multiple line items.
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
   * async function deleteReservationItemsByLineItem (
   *   lineItemIds: string[]
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.deleteReservationItemsByLineItem(
   *     lineItemIds
   *   )
   * }
   */
  deleteReservationItemsByLineItem(
    lineItemId: string | string[],
    context?: SharedContext
  ): Promise<void>

  /**
   * This method is used to delete a reservation item or multiple reservation items by their IDs.
   *
   * @param {string | string[]} reservationItemId - The ID(s) of the reservation item(s) to delete.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the reservation item(s) are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function deleteReservationItems (
   *   reservationItemIds: string[]
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.deleteReservationItem(
   *     reservationItemIds
   *   )
   * }
   */
  deleteReservationItem(
    reservationItemId: string | string[],
    context?: SharedContext
  ): Promise<void>

  /**
   * This method is used to delete an inventory item or multiple inventory items. The inventory items are only soft deleted and can be restored using the
   * {@link restoreInventoryItem} method.
   *
   * @param {string | string[]} inventoryItemId - The ID(s) of the inventory item(s) to delete.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the inventory item(s) are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function deleteInventoryItem (
   *   inventoryItems: string[]
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.deleteInventoryItem(
   *     inventoryItems
   *   )
   * }
   */
  deleteInventoryItem(
    inventoryItemId: string | string[],
    context?: SharedContext
  ): Promise<void>

  /**
   * This method is used to restore an inventory item or multiple inventory items that were previously deleted using the {@link deleteInventoryItem} method.
   *
   * @param {string | string[]} inventoryItemId - The ID(s) of the inventory item(s) to restore.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the inventory item(s) are successfully restored.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function restoreInventoryItem (
   *   inventoryItems: string[]
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.restoreInventoryItem(
   *     inventoryItems
   *   )
   * }
   */
  restoreInventoryItem(
    inventoryItemId: string | string[],
    context?: SharedContext
  ): Promise<void>

  /**
   * This method deletes the inventory item level(s) for the ID(s) of associated location(s).
   *
   * @param {string | string[]} locationId - The ID(s) of the associated location(s).
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the inventory item level(s) are successfully restored.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function deleteInventoryItemLevelByLocationId (
   *   locationIds: string[]
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.deleteInventoryItemLevelByLocationId(
   *     locationIds
   *   )
   * }
   */
  deleteInventoryItemLevelByLocationId(
    locationId: string | string[],
    context?: SharedContext
  ): Promise<void>

  /**
   * This method deletes reservation item(s) by the ID(s) of associated location(s).
   *
   * @param {string | string[]} locationId - The ID(s) of the associated location(s).
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the reservation item(s) are successfully restored.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function deleteReservationItemByLocationId (
   *   locationIds: string[]
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.deleteReservationItemByLocationId(
   *     locationIds
   *   )
   * }
   */
  deleteReservationItemByLocationId(
    locationId: string | string[],
    context?: SharedContext
  ): Promise<void>

  /**
   * This method is used to delete an inventory level. The inventory level is identified by the IDs of its associated inventory item and location.
   *
   * @param {string} inventoryItemId - The ID of the associated inventory item.
   * @param {string} locationId - The ID of the associated location.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the inventory level(s) are successfully restored.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function deleteInventoryLevel (
   *   inventoryItemId: string,
   *   locationId: string
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   await inventoryModule.deleteInventoryLevel(
   *     inventoryItemId,
   *     locationId
   *   )
   * }
   */
  deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context?: SharedContext
  ): Promise<void>

  /**
   * This method is used to adjust the inventory level's stocked quantity. The inventory level is identified by the IDs of its associated inventory item and location.
   *
   * @param {string} inventoryItemId - The ID of the associated inventory item.
   * @param {string} locationId - The ID of the associated location.
   * @param {number} adjustment - A positive or negative number used to adjust the inventory level's stocked quantity.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InventoryLevelDTO>} The inventory level's details.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function adjustInventory (
   *   inventoryItemId: string,
   *   locationId: string,
   *   adjustment: number
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const inventoryLevel = await inventoryModule.adjustInventory(
   *     inventoryItemId,
   *     locationId,
   *     adjustment
   *   )
   *
   *   // do something with the inventory level or return it.
   * }
   */
  adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  /**
   * This method is used to confirm whether the specified quantity of an inventory item is available in the specified locations.
   *
   * @param {string} inventoryItemId - The ID of the inventory item to check its availability.
   * @param {string[]} locationIds - The IDs of the locations to check the quantity availability in.
   * @param {number} quantity - The quantity to check if available for the inventory item in the specified locations.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<boolean>} Whether the specified quantity is available for the inventory item in the specified locations.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function confirmInventory (
   *   inventoryItemId: string,
   *   locationIds: string[],
   *   quantity: number
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   return await inventoryModule.confirmInventory(
   *     inventoryItemId,
   *     locationIds,
   *     quantity
   *   )
   * }
   */
  confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    context?: SharedContext
  ): Promise<boolean>

  /**
   * This method is used to retrieve the available quantity of an inventory item within the specified locations.
   *
   * @param {string} inventoryItemId - The ID of the inventory item to retrieve its quantity.
   * @param {string[]} locationIds - The IDs of the locations to retrieve the available quantity from.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<number>} The available quantity of the inventory item in the specified locations.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveAvailableQuantity (
   *   inventoryItemId: string,
   *   locationIds: string[],
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const quantity = await inventoryModule.retrieveAvailableQuantity(
   *     inventoryItemId,
   *     locationIds,
   *   )
   *
   *   // do something with the quantity or return it
   * }
   */
  retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number>

  /**
   * This method is used to retrieve the stocked quantity of an inventory item within the specified locations.
   *
   * @param {string} inventoryItemId - The ID of the inventory item to retrieve its stocked quantity.
   * @param {string[]} locationIds - The IDs of the locations to retrieve the stocked quantity from.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<number>} The stocked quantity of the inventory item in the specified locations.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveStockedQuantity (
   *   inventoryItemId: string,
   *   locationIds: string[],
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const quantity = await inventoryModule.retrieveStockedQuantity(
   *     inventoryItemId,
   *     locationIds,
   *   )
   *
   *   // do something with the quantity or return it
   * }
   */
  retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number>

  /**
   * This method is used to retrieve the reserved quantity of an inventory item within the specified locations.
   *
   * @param {string} inventoryItemId - The ID of the inventory item to retrieve its reserved quantity.
   * @param {string[]} locationIds - The IDs of the locations to retrieve the reserved quantity from.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<number>} The reserved quantity of the inventory item in the specified locations.
   *
   * @example
   * import {
   *   initialize as initializeInventoryModule,
   * } from "@medusajs/inventory"
   *
   * async function retrieveReservedQuantity (
   *   inventoryItemId: string,
   *   locationIds: string[],
   * ) {
   *   const inventoryModule = await initializeInventoryModule({})
   *
   *   const quantity = await inventoryModule.retrieveReservedQuantity(
   *     inventoryItemId,
   *     locationIds,
   *   )
   *
   *   // do something with the quantity or return it
   * }
   */
  retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number>
}
