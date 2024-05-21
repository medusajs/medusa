import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FilterableCurrencyProps, CurrencyDTO } from "./common"

/**
 * The main service interface for the Currency Module.
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
   * const currency = await currencyModuleService.retrieve("usd")
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
   * const currencies = await currencyModuleService.list({
   *   code: ["usd", "eur"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const currencies = await currencyModuleService.list(
   *   {
   *     code: ["usd", "eur"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
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
   * const [currencies, count] =
   *   await currencyModuleService.listAndCount({
   *     code: ["usd", "eur"],
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [currencies, count] =
   *   await currencyModuleService.listAndCount(
   *     {
   *       code: ["usd", "eur"],
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCount(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyDTO>,
    sharedContext?: Context
  ): Promise<[CurrencyDTO[], number]>
}
