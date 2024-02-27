import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  StockLocationDTO,
  UpdateStockLocationInput,
} from "./common"

import { FindConfig } from "../common/common"
import { IModuleService } from "../modules-sdk"
import { SharedContext } from "../shared-context"

/**
 * The main service interface for the stock location's module.
 */
export interface IStockLocationService extends IModuleService {
  /**
   * This method is used to retrieve a paginated list of stock locations based on optional filters and configuration.
   *
   * @param {FilterableStockLocationProps} selector - The filters to apply on the retrieved stock locations.
   * @param {FindConfig<StockLocationDTO>} config -
   * The configurations determining how the stock locations are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a stock location.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @return {Promise<StockLocationDTO[]>} The list of stock locations.
   *
   * @example
   * To retrieve a list of stock locations using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function listStockLocations (ids: string[]) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const stockLocations = await stockLocationModule.list({
   *     id: ids
   *   })
   *
   *   // do something with the stock locations or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the stock locations:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function listStockLocations (ids: string[]) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const stockLocations = await stockLocationModule.list({
   *     id: ids
   *   }, {
   *     relations: ["address"]
   *   })
   *
   *   // do something with the stock locations or return them
   * }
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function listStockLocations (ids: string[], skip: number, take: number) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const stockLocations = await stockLocationModule.list({
   *     id: ids
   *   }, {
   *     relations: ["address"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the stock locations or return them
   * }
   * ```
   */
  list(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: SharedContext
  ): Promise<StockLocationDTO[]>

  /**
   * This method is used to retrieve a paginated list of stock locations along with the total count of available stock locations satisfying the provided filters.
   *
   * @param {FilterableStockLocationProps} selector - The filters to apply on the retrieved stock locations.
   * @param {FindConfig<StockLocationDTO>} config -
   * The configurations determining how the stock locations are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a stock location.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @return {Promise<[StockLocationDTO[], number]>} The list of stock locations along with the total count.
   *
   * @example
   * To retrieve a list of stock locations using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function listStockLocations (ids: string[]) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const [stockLocations, count] = await stockLocationModule.listAndCount({
   *     id: ids
   *   })
   *
   *   // do something with the stock locations or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the stock locations:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function listStockLocations (ids: string[]) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const [stockLocations, count] = await stockLocationModule.listAndCount({
   *     id: ids
   *   }, {
   *     relations: ["address"]
   *   })
   *
   *   // do something with the stock locations or return them
   * }
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function listStockLocations (ids: string[], skip: number, take: number) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const [stockLocations, count] = await stockLocationModule.listAndCount({
   *     id: ids
   *   }, {
   *     relations: ["address"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the stock locations or return them
   * }
   * ```
   */
  listAndCount(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: SharedContext
  ): Promise<[StockLocationDTO[], number]>

  /**
   * This method is used to retrieve a stock location by its ID
   *
   * @param {string} id - The ID of the stock location
   * @param {FindConfig<StockLocationDTO>} config -
   * The configurations determining how the stock location is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a stock location.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO>} The stock location's details.
   *
   * @example
   * A simple example that retrieves a inventory item by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function retrieveStockLocation (id: string) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const stockLocation = await stockLocationModule.retrieve(id)
   *
   *   // do something with the stock location or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function retrieveStockLocation (id: string) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const stockLocation = await stockLocationModule.retrieve(id, {
   *     relations: ["address"]
   *   })
   *
   *   // do something with the stock location or return it
   * }
   * ```
   */
  retrieve(
    id: string,
    config?: FindConfig<StockLocationDTO>,
    context?: SharedContext
  ): Promise<StockLocationDTO>

  /**
   * This method is used to create a stock location.
   *
   * @param {CreateStockLocationInput} input - The details of the stock location to create.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO>} The created stock location's details.
   *
   * @example
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function createStockLocation (name: string) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const stockLocation = await stockLocationModule.create({
   *     name
   *   })
   *
   *   // do something with the stock location or return it
   * }
   */
  create(
    input: CreateStockLocationInput,
    context?: SharedContext
  ): Promise<StockLocationDTO>

  /**
   * This method is used to update a stock location.
   *
   * @param {string} id - The ID of the stock location.
   * @param {UpdateStockLocationInput} input - The attributes to update in the stock location.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO>} The stock location's details.
   *
   * @example
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function updateStockLocation (id:string, name: string) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   const stockLocation = await stockLocationModule.update(id, {
   *     name
   *   })
   *
   *   // do something with the stock location or return it
   * }
   */
  update(
    id: string,
    input: UpdateStockLocationInput,
    context?: SharedContext
  ): Promise<StockLocationDTO>

  /**
   * This method is used to delete a stock location.
   *
   * @param {string} id - The ID of the stock location.
   * @param {SharedContext} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the stock location is successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeStockLocationModule,
   * } from "@medusajs/stock-location"
   *
   * async function deleteStockLocation (id:string) {
   *   const stockLocationModule = await initializeStockLocationModule({})
   *
   *   await stockLocationModule.delete(id)
   * }
   */
  delete(id: string, context?: SharedContext): Promise<void>
}
