import { MoneyAmount } from "../models"
import { PriceListType } from "../types/price-list"
import { TaxServiceRate } from "../types/tax-service"
import { ITransactionBaseService, MedusaContainer } from "@medusajs/types"
import { TransactionBaseService } from "./transaction-base-service"

/**
 * ## Overview
 *
 * The price selection strategy retrieves the best price for a product variant for a specific context such as selected region, taxes applied,
 * the quantity in cart, and more.
 *
 * Medusa provides a default price selection strategy, but you can override it. A price selecion strategy is a TypeScript or JavaScript file in the `src/strategies` directory of your Medusa backend project. It exports a class that extends the `AbstractPriceSelectionStrategy` class.
 *
 * For example:
 *
 * ```ts title="src/strategies/price.ts"
 * import {
 *   AbstractPriceSelectionStrategy,
 *   PriceSelectionContext,
 *   PriceSelectionResult,
 * } from "@medusajs/medusa"
 *
 * export default class MyStrategy extends
 *   AbstractPriceSelectionStrategy {
 *
 *   async calculateVariantPrice(
 *     data: {
 *       variantId: string;
 *       quantity?: number
 *     }[],
 *     context: PriceSelectionContext
 *   ): Promise<Map<string, PriceSelectionResult>> {
 *     throw new Error("Method not implemented.")
 *   }
 * }
 * ```
 *
 * ---
 */
export interface IPriceSelectionStrategy extends ITransactionBaseService {
  /**
   * This method retrieves one or more product variants' prices. It's used when retrieving product variants or their associated line items.
   * It's also used when retrieving other entities that product variants and line items belong to, such as products and carts respectively.
   *
   * @param data - The necessary data to perform the price selection for each variant ID.
   * @param context - The context of the price selection.
   * @returns {Promise<Map<string, PriceSelectionResult>>} A map, each key is an ID of a variant, and its value is an object holding the price selection result.
   *
   * @example
   * For example, here's a snippet of how the price selection strategy is implemented in the Medusa backend:
   *
   * ```ts
   * import {
   *   AbstractPriceSelectionStrategy,
   *   CustomerService,
   *   PriceSelectionContext,
   *   PriceSelectionResult,
   * } from "@medusajs/medusa"
   *
   * type InjectedDependencies = {
   *   customerService: CustomerService
   * }
   *
   * export default class MyStrategy extends
   *   AbstractPriceSelectionStrategy {
   *
   *   async calculateVariantPrice(
   *     data: {
   *       variantId: string
   *       quantity?: number
   *     }[],
   *     context: PriceSelectionContext
   *   ): Promise<Map<string, PriceSelectionResult>> {
   *     const dataMap = new Map(data.map((d) => [d.variantId, d]))
   *
   *     const cacheKeysMap = new Map(
   *       data.map(({ variantId, quantity }) => [
   *         variantId,
   *         this.getCacheKey(variantId, { ...context, quantity }),
   *       ])
   *     )
   *
   *     const nonCachedData: {
   *       variantId: string
   *       quantity?: number
   *     }[] = []
   *
   *     const variantPricesMap = new Map<string, PriceSelectionResult>()
   *
   *     if (!context.ignore_cache) {
   *       const cacheHits = await promiseAll(
   *         [...cacheKeysMap].map(async ([, cacheKey]) => {
   *           return await this.cacheService_.get<PriceSelectionResult>(cacheKey)
   *         })
   *       )
   *
   *       if (!cacheHits.length) {
   *         nonCachedData.push(...dataMap.values())
   *       }
   *
   *       for (const [index, cacheHit] of cacheHits.entries()) {
   *         const variantId = data[index].variantId
   *         if (cacheHit) {
   *           variantPricesMap.set(variantId, cacheHit)
   *           continue
   *         }
   *
   *         nonCachedData.push(dataMap.get(variantId)!)
   *       }
   *     } else {
   *       nonCachedData.push(...dataMap.values())
   *     }
   *
   *     let results: Map<string, PriceSelectionResult> = new Map()
   *
   *     if (
   *       this.featureFlagRouter_.isFeatureEnabled(
   *         TaxInclusivePricingFeatureFlag.key
   *       )
   *     ) {
   *       results = await this.calculateVariantPrice_new(nonCachedData, context)
   *     } else {
   *       results = await this.calculateVariantPrice_old(nonCachedData, context)
   *     }
   *
   *     await promiseAll(
   *       [...results].map(async ([variantId, prices]) => {
   *         variantPricesMap.set(variantId, prices)
   *         if (!context.ignore_cache) {
   *           await this.cacheService_.set(cacheKeysMap.get(variantId)!, prices)
   *         }
   *       })
   *     )
   *
   *     return variantPricesMap
   *   }
   *
   *   // ...
   * }
   * ```
   */
  calculateVariantPrice(
    data: {
      /**
       * The ID of the variant to retrieve its prices.
       */
      variantId: string
      /**
       * The variant's quantity in the cart, if available.
       */
      quantity?: number
    }[],
    /**
     * Details relevant to determine the correct pricing of the variant
     */
    context: PriceSelectionContext
  ): Promise<Map<string, PriceSelectionResult>>

  /**
   * This method is called when prices of product variants have changed.
   * You can use it to invalidate prices stored in the cache.
   *
   * @param {string[]} variantIds - The IDs of the updated variants.
   * @returns {Promise<void>} Resolves after any necessary actions are performed.
   *
   * @example
   * For example, this is how this method is implemented in the Medusa backend's default
   * price selection strategy:
   *
   * ```ts
   * import {
   *   AbstractPriceSelectionStrategy,
   *   CustomerService,
   * } from "@medusajs/medusa"
   * import { promiseAll } from "@medusajs/utils"
   *
   * type InjectedDependencies = {
   *   customerService: CustomerService
   * }
   *
   * export default class MyStrategy extends
   *   AbstractPriceSelectionStrategy {
   *
   *   public async onVariantsPricesUpdate(variantIds: string[]): Promise<void> {
   *     await promiseAll(
   *       variantIds.map(
   *         async (id: string) => await this.cacheService_.invalidate(`ps:${id}:*`)
   *       )
   *     )
   *   }
   *
   *   // ...
   * }
   * ```
   *
   * :::note
   *
   * Learn more about the cache service in [this documentation](https://docs.medusajs.com/development/cache/overview).
   *
   * :::
   */
  onVariantsPricesUpdate(variantIds: string[]): Promise<void>
}

/**
 * @parentIgnore activeManager_,atomicPhase_,shouldRetryTransaction_,withTransaction
 */
export abstract class AbstractPriceSelectionStrategy
  extends TransactionBaseService
  implements IPriceSelectionStrategy
{
  /**
   * @ignore
   */
  static _isPriceSelectionStrategy = true

  /**
   * @ignore
   */
  static isPriceSelectionStrategy(object): boolean {
    return object?.constructor?._isPriceSelectionStrategy
  }

  /**
   * You can use the `constructor` of your price-selection strategy to access the different services in Medusa through dependency injection.
   *
   * @param {Record<string, unknown>} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend.
   * @param {Record<string, unknown>} config - If this price-selection strategy is created in a plugin, the plugin's options are passed in this parameter.
   *
   * @example
   * // ...
   * import {
   *   AbstractPriceSelectionStrategy,
   *   CustomerService,
   * } from "@medusajs/medusa"
   * type InjectedDependencies = {
   *   customerService: CustomerService
   * }
   *
   * class MyStrategy extends
   *   AbstractPriceSelectionStrategy {
   *
   *   protected customerService_: CustomerService
   *
   *   constructor(container: InjectedDependencies) {
   *     super(container)
   *     this.customerService_ = container.customerService
   *   }
   *
   *   // ...
   * }
   *
   * export default  MyStrategy
   */
  protected constructor(
    protected readonly container: Record<string, unknown>,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
    super(container, config)
  }

  public abstract calculateVariantPrice(
    data: {
      variantId: string
      /**
       * @ignore
       */
      taxRates: TaxServiceRate[]
      quantity?: number
    }[],
    context: PriceSelectionContext
  ): Promise<Map<string, PriceSelectionResult>>

  public async onVariantsPricesUpdate(variantIds: string[]): Promise<void> {
    return void 0
  }
}

/**
 * @interface
 *
 * The context of the price selection.
 */
export type PriceSelectionContext = {
  /**
   * The cart's ID. This is used when the prices are being retrieved for the variant of a line item,
   * as it is used to determine the current region and currency code of the context.
   */
  cart_id?: string
  /**
   * The ID of the customer viewing the variant.
   */
  customer_id?: string
  /**
   * The region's ID.
   */
  region_id?: string
  /**
   * The quantity of the item in the cart. This is used to filter out price lists that have
   * `min_quantity` or `max_quantity` conditions set.
   */
  quantity?: number
  /**
   * The currency code the customer is using.
   */
  currency_code?: string
  /**
   * Whether the price list's prices should be retrieved or not.
   */
  include_discount_prices?: boolean
  /**
   * The tax rates to be applied. This is only used for
   * [Tax-Inclusive Pricing](https://docs.medusajs.com/modules/taxes/inclusive-pricing).
   */
  tax_rates?: TaxServiceRate[]
  /**
   * Whether to calculate the prices even if the value of an earlier price calculation
   * is available in the cache.
   */
  ignore_cache?: boolean
}

/**
 * @enum
 *
 * The type of default price type.
 */
enum DefaultPriceType {
  /**
   * The `calculatedPrice` is the original price.
   */
  DEFAULT = "default",
}

// both exports are needed in order to get proper typing of the calculatedPriceType field.
export type PriceType = DefaultPriceType | PriceListType
export const PriceType = { ...DefaultPriceType, ...PriceListType }

/**
 * @interface
 *
 * The price selection result of a variant.
 */
export type PriceSelectionResult = {
  /**
   * The original price of the variant which depends on the selected region or currency code in the context object.
   * If both region ID and currency code are available in the context object, the region has higher precedence.
   */
  originalPrice: number | null
  /**
   * Whether the original price includes taxes or not. This is only available
   * for [Tax-Inclusive Pricing](https://docs.medusajs.com/modules/taxes/inclusive-pricing).
   */
  originalPriceIncludesTax?: boolean | null
  /**
   * The lowest price among the prices of the product variant retrieved using the context object.
   */
  calculatedPrice: number | null
  /**
   * Whether the calculated price includes taxes or not.
   * This is only available for [Tax-Inclusive Pricing](https://docs.medusajs.com/modules/taxes/inclusive-pricing).
   */
  calculatedPriceIncludesTax?: boolean | null
  /**
   * The type of price applied in `calculatedPrice`.
   */
  calculatedPriceType?: PriceType
  /**
   * All possible prices of the variant that are retrieved using the `context` object.
   * It can include its original price and its price lists if there are any.
   */
  prices: MoneyAmount[]
}
