import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  StockLocationDTO,
  UpdateStockLocationInput,
  UpdateStockLocationNextInput,
} from "./common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"

import { Context } from "../shared-context"
import { FindConfig } from "../common/common"
import { IModuleService } from "../modules-sdk"

/**
 * The main service interface for the Stock Location Module.
 */
export interface IStockLocationServiceNext extends IModuleService {
  /**
   * This method retrieves a paginated list of stock locations based on optional filters and configuration.
   *
   * @param {FilterableStockLocationProps} selector - The filters to apply on the retrieved stock locations.
   * @param {FindConfig<StockLocationDTO>} config - The configurations determining how the stock location is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a stock location.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO[]>} The list of stock locations.
   *
   * @example
   * To retrieve a list of stock locations using their IDs:
   *
   * ```ts
   * const stockLocations = await stockLocationModuleService.list({
   *   id: ["sloc_123", "sloc_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the stock locations:
   *
   * ```ts
   * const stockLocations = await stockLocationModuleService.list(
   *   {
   *     id: ["sloc_123", "sloc_321"],
   *   },
   *   {
   *     relations: ["address"],
   *   }
   * )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const stockLocations = await stockLocationModuleService.list(
   *   {
   *     id: ["sloc_123", "sloc_321"],
   *   },
   *   {
   *     relations: ["address"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  list(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: Context
  ): Promise<StockLocationDTO[]>

  /**
   * This method retrieves a paginated list of stock locations along with the total count of available stock locations satisfying the provided filters.
   *
   * @param {FilterableStockLocationProps} selector - The filters to apply on the retrieved stock locations.
   * @param {FindConfig<StockLocationDTO>} config - The configurations determining how the stock location is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a stock location.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[StockLocationDTO[], number]>} The list of stock locations along with their total count.
   *
   * @example
   * To retrieve a list of stock locations using their IDs:
   *
   * ```ts
   * const [stockLocations, count] =
   *   await stockLocationModuleService.list({
   *     id: ["sloc_123", "sloc_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the stock locations:
   *
   * ```ts
   * const [stockLocations, count] =
   *   await stockLocationModuleService.list(
   *     {
   *       id: ["sloc_123", "sloc_321"],
   *     },
   *     {
   *       relations: ["address"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [stockLocations, count] =
   *   await stockLocationModuleService.list(
   *     {
   *       id: ["sloc_123", "sloc_321"],
   *     },
   *     {
   *       relations: ["address"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCount(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>,
    context?: Context
  ): Promise<[StockLocationDTO[], number]>

  /**
   * This method retrieves a stock location by its ID.
   *
   * @param {string} id - The ID of the stock location.
   * @param {FindConfig<StockLocationDTO>} config - The configurations determining how the stock location is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a stock location.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO>} The retrieved stock location.
   *
   * @example
   * const stockLocation =
   *   await stockLocationModuleService.retrieve("sloc_123")
   */
  retrieve(
    id: string,
    config?: FindConfig<StockLocationDTO>,
    context?: Context
  ): Promise<StockLocationDTO>

  /**
   * This method creates a stock location.
   *
   * @param {CreateStockLocationInput} input - The stock location to create.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO>} The created stock location.
   *
   * @example
   * const stockLocation = await stockLocationModuleService.create(
   *   {
   *     name: "Warehouse",
   *     address: {
   *       address_1: "1855 Powder Mill Rd",
   *       country_code: "us",
   *     },
   *   }
   * )
   */
  create(
    input: CreateStockLocationInput,
    context?: Context
  ): Promise<StockLocationDTO>

  /**
   * This method creates stock locations.
   *
   * @param {CreateStockLocationInput[]} input - The stock locations to create.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO[]>} The created stock locations.
   *
   * @example
   * const stockLocations =
   *   await stockLocationModuleService.create([
   *     {
   *       name: "Warehouse",
   *       address: {
   *         address_1: "1855 Powder Mill Rd",
   *         country_code: "us",
   *       },
   *     },
   *     {
   *       name: "Warehouse 2",
   *       address_id: "laddr_123",
   *     },
   *   ])
   */
  create(
    input: CreateStockLocationInput[],
    context?: Context
  ): Promise<StockLocationDTO[]>

  /**
   * This method updates existing stock locations.
   *
   * @param {UpdateStockLocationNextInput[]} input - The attributes to update in the stock locations.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO[]>} The updated stock locations.
   *
   * @example
   * const stockLocations =
   *   await stockLocationModuleService.update([
   *     {
   *       id: "sloc_123",
   *       name: "Warehouse",
   *     },
   *     {
   *       id: "sloc_321",
   *       address_id: "laddr_123",
   *     },
   *   ])
   */
  update(
    input: UpdateStockLocationNextInput[],
    context?: Context
  ): Promise<StockLocationDTO[]>

  /**
   * This method updates an existing stock location.
   *
   * @param {UpdateStockLocationNextInput} input - The attributes to update in the stock location.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<StockLocationDTO>} The updated stock location.
   *
   * @example
   * const stockLocations =
   *   await stockLocationModuleService.update({
   *     id: "sloc_123",
   *     name: "Warehouse",
   *   })
   */
  update(
    input: UpdateStockLocationNextInput,
    context?: Context
  ): Promise<StockLocationDTO>

  /**
   * This method deletes a stock location by its ID.
   *
   * @param {string} id - The ID of the stock location.
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the stock location is deleted successfully.
   *
   * @example
   * await stockLocationModuleService.delete("sloc_123")
   */
  delete(id: string, context?: Context): Promise<void>

  /**
   * Soft delete stock locations
   * @param stockLocationIds
   * @param config
   * @param sharedContext
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    stockLocationIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to restore a stock location or multiple stock locations that were previously deleted using the {@link softDelete} method.
   *
   * @param {string[]} stockLocationIds - The ID(s) of the stock location(s) to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Restore config
   * @param {Context} context - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the stock location(s) are successfully restored.
   */
  restore<TReturnableLinkableKeys extends string = string>(
    stockLocationIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
