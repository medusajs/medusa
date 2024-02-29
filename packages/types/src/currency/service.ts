import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableCurrencyProps, CurrencyDTO } from "./common"

/**
 * The main service interface for the currency module.
 */
export interface ICurrencyModuleService extends IModuleService {
  /**
   * This method retrieves a currency by its code and and optionally based on the provided configurations.
   *
   * @param {string} code - The code of the currency to retrieve.
   * @param {FindConfig<CurrencyDTO>} config -
   * The configurations determining how the currency is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO>} The retrieved currency.
   *
   * @example
   * A simple example that retrieves a currency by its code:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrency (code: string) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const currency = await currencyModule.retrieve(
   *     code
   *   )
   *
   *   // do something with the currency or return it
   * }
   * ```
   *
   * To specify attributes that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrency (code: string) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const currency = await currencyModule.retrieve(
   *     code,
   *     {
   *       select: ["symbol_native"]
   *     }
   *   )
   *
   *   // do something with the currency or return it
   * }
   * ```
   */
  retrieve(
    code: string,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO>

  /**
   * This method is used to retrieve a paginated list of currencies based on optional filters and configuration.
   *
   * @param {FilterableCurrencyProps} filters - The filters to apply on the retrieved currencies.
   * @param {FindConfig<CurrencyDTO>} config -
   * The configurations determining how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CurrencyDTO[]>} The list of currencies.
   *
   * @example
   *
   * To retrieve a list of currencies using their codes:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const currencies = await currencyModule.list(
   *     {
   *       code: codes
   *     },
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const currencies = await currencyModule.list(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"]
   *     }
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrencies (codes: string[], skip: number, take: number) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const currencies = await currencyModule.list(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   */
  list(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyDTO[]>

  /**
   * This method is used to retrieve a paginated list of currencies along with the total count of available currencies satisfying the provided filters.
   *
   * @param {FilterableCurrencyProps} filters - The filters to apply on the retrieved currencies.
   * @param {FindConfig<CurrencyDTO>} config -
   * The configurations determining how the currencies are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a currency.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CurrencyDTO[], number]>} The list of currencies along with the total count.
   *
   * @example
   *
   * To retrieve a list of currencies using their codes:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const [currencies, count] = await currencyModule.listAndCount(
   *     {
   *       code: codes
   *     },
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the money amounts:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrencies (codes: string[]) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const [currencies, count] = await currencyModule.listAndCount(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"]
   *     }
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeCurrencyModule,
   * } from "@medusajs/currency"
   *
   * async function retrieveCurrencies (codes: string[], skip: number, take: number) {
   *   const currencyModule = await initializeCurrencyModule()
   *
   *   const [currencies, count] = await currencyModule.listAndCount(
   *     {
   *       code: codes
   *     },
   *     {
   *       select: ["symbol_native"],
   *       skip,
   *       take
   *     }
   *   )
   *
   *   // do something with the currencies or return them
   * }
   * ```
   */
  listAndCount(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<[CurrencyDTO[], number]>
}
