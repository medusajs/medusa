import { BaseFilterable } from "../../dal"
import { Context } from "../../shared-context"
import { BigNumberInput, BigNumberValue } from "../../totals"
import {
  CreateMoneyAmountDTO,
  FilterableMoneyAmountProps,
  MoneyAmountDTO,
} from "./money-amount"

export interface PricingRepositoryService {
  calculatePrices(
    pricingFilters: PricingFilters,
    pricingContext: PricingContext,
    context: Context
  ): Promise<CalculatedPriceSetDTO[]>
}

/**
 * @interface
 *
 * The context to calculate prices. For example, you can specify the currency code to calculate prices in.
 *
 */
export interface PricingContext {
  /**
   * an object whose keys are the name of the context attribute. Its value can be a string or a BigNumberInput. For example, you can pass the `currency_code` property with its value being the currency code to calculate the price in.
   * Another example is passing the `quantity` property to calculate the price for that specified quantity, which finds a price set whose `min_quantity` and `max_quantity` conditions match the specified quantity.
   */
  context?: Record<string, string | BigNumberInput>
}

/**
 * @interface
 *
 * Filters to apply when calculating prices.
 */
export interface PricingFilters {
  /**
   * IDs of the price sets to use in the
   * calculation.
   */
  id: string[]
}

/**
 * @interface
 *
 * A price set's data.
 */
export interface PriceSetDTO {
  /**
   * The ID of the price set.
   */
  id: string
  /**
   * The prices that belong to this price set.
   */
  prices?: MoneyAmountDTO[]

  /**
   * The calculated price based on the context.
   */
  calculated_price?: CalculatedPriceSet
}

/**
 * @interface
 *
 * A calculated price set's data.
 *
 * @privateRemarks
 * Do we still need this type? Shouldn't we use CalculatedPriceSet instead?
 */
export interface CalculatedPriceSetDTO {
  /**
   * The ID of the money amount.
   */
  id: string
  /**
   * The ID of the associated price set.
   */
  price_set_id: string
  /**
   * The calculated amount. It can possibly be `null` if there's no price set up for the provided context.
   */
  amount: string | null
  /**
   * The currency code of the calculated price. It can possibly be `null`.
   */
  currency_code: string | null
  /**
   * The minimum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
   */
  min_quantity: string | null
  /**
   * The maximum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
   */
  max_quantity: string | null
  /**
   * The type of the associated price list, if any.
   */
  price_list_type: string | null
  /**
   * The ID of the associated price list, if any.
   */
  price_list_id: string | null
}

/**
 * @interface
 *
 * The calculated price for a specific price set and context.
 */
export interface CalculatedPriceSet {
  /**
   * The ID of the price set.
   */
  id: string
  /**
   * Whether the calculated price is associated with a price list. During the calculation process, if no valid price list is found,
   * the calculated price is set to the original price, which doesn't belong to a price list. In that case, the value of this property is `false`.
   */
  is_calculated_price_price_list?: boolean
  /**
   * The amount of the calculated price, or `null` if there isn't a calculated price.
   */
  calculated_amount: BigNumberValue | null

  /**
   * Whether the original price is associated with a price list. During the calculation process, if the price list of the calculated price is of type override,
   * the original price will be the same as the calculated price. In that case, the value of this property is `true`.
   */
  is_original_price_price_list?: boolean
  /**
   * The amount of the original price, or `null` if there isn't a calculated price.
   */
  original_amount: BigNumberValue | null

  /**
   * The currency code of the calculated price, or null if there isn't a calculated price.
   */
  currency_code: string | null

  /**
   * The details of the calculated price.
   */
  calculated_price?: {
    /**
     * The ID of the price selected as the calculated price.
     */
    id: string | null
    /**
     * The ID of the associated price list, if any.
     */
    price_list_id: string | null
    /**
     * The type of the associated price list, if any.
     */
    price_list_type: string | null
    /**
     * The `min_quantity` field defined on a price.
     */
    min_quantity: BigNumberValue | null
    /**
     * The `max_quantity` field defined on a price.
     */
    max_quantity: BigNumberValue | null
  }

  /**
   * The details of the original price.
   */
  original_price?: {
    /**
     * The ID of the price selected as the original price.
     */
    id: string | null
    /**
     * The ID of the associated price list, if any.
     */
    price_list_id: string | null
    /**
     * The type of the associated price list, if any.
     */
    price_list_type: string | null
    /**
     * The `min_quantity` field defined on a price.
     */
    min_quantity: BigNumberValue | null
    /**
     * The `max_quantity` field defined on a price.
     */
    max_quantity: BigNumberValue | null
  }
}

/**
 * @interface
 *
 * The price rules to be set for each price in the price set.
 *
 * Each key of the object is a the attribute, and its value
 * is the values of the rule.
 */
export interface CreatePriceSetPriceRules extends Record<string, string> {}

/**
 * @interface
 *
 * The prices to create part of a price set.
 */
export interface CreatePricesDTO extends CreateMoneyAmountDTO {
  /**
   * The rules to add to the price. The object's keys are the attribute, and values are the value of that rule associated with this price.
   */
  rules?: CreatePriceSetPriceRules
}

/**
 * @interface
 *
 * The prices to add to a price set.
 */
export interface AddPricesDTO {
  /**
   * The ID of the price set to add prices to.
   */
  priceSetId: string
  /**
   * The prices to add to the price set.
   */
  prices: CreatePricesDTO[]
}

/**
 * @interface
 *
 * A price set to create.
 */
export interface CreatePriceSetDTO {
  /**
   * The prices to create and add to this price set.
   */
  prices?: CreatePricesDTO[]
}

/**
 * @interface
 *
 * The data to upsert in a price set.
 */
export interface UpsertPriceSetDTO extends UpdatePriceSetDTO {
  /**
   * A string indicating the ID of the price set to update.
   * If not provided, a price set is created.
   */
  id?: string
}

/**
 * @interface
 *
 * The data to update in a price set.
 */
export interface UpdatePriceSetDTO {
  /**
   * The prices to create and add to this price set.
   */
  prices?: CreatePricesDTO[]
}

/**
 * @interface
 *
 * Filters to apply on price sets.
 */
export interface FilterablePriceSetProps
  extends BaseFilterable<FilterablePriceSetProps>,
    PricingContext {
  /**
   * IDs to filter price sets by.
   */
  id?: string[]
  /**
   * Filters to apply on a price set's associated money amounts.
   */
  money_amounts?: FilterableMoneyAmountProps
}
