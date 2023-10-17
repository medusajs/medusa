import { BaseFilterable } from "../../dal"
import {
  CreateMoneyAmountDTO,
  FilterableMoneyAmountProps,
  MoneyAmountDTO,
} from "./money-amount"
import { RuleTypeDTO } from "./rule-type"

/**
 * @interface
 * 
 * The context to calculate prices. For example, you can specify the currency code to calculate prices in.
 * 
 * @prop context - 
 * an object whose keys are the name of the context attribute. Its value can be a string or a number. For example, you can pass the `currency_code` property with its value being the currency code to calculate the price in.
 * Another example is passing the `quantity` property to calculate the price for that specified quantity, which finds a price set whose `min_quantity` and `max_quantity` conditions match the specified quantity.
 * 
 */
export interface PricingContext {
  context?: Record<string, string | number>
}

/**
 * @interface
 * 
 * Filters to apply on prices.
 * 
 * @prop id - IDs to filter prices.
 */
export interface PricingFilters {
  id: string[]
}

/**
 * @interface
 * 
 * A price set's data.
 * 
 * @prop id - The ID of the price set.
 * @prop money_amounts - The prices that belong to this price set.
 * @prop rule_types - The rule types applied on this price set.
 * 
 */
export interface PriceSetDTO {
  id: string
  money_amounts?: MoneyAmountDTO[]
  rule_types?: RuleTypeDTO[]
}

/**
 * @interface
 * 
 * A calculated price set's data.
 * 
 * @prop id - The ID of the price set.
 * @prop amount - The calculated amount. It can possibly be `null` if there's no price set up for the provided context.
 * @prop currency_code - The currency code of the calculated price. It can possibly be `null`.
 * @prop min_quantity - The minimum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
 * @prop max_quantity - The maximum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
 */
export interface CalculatedPriceSetDTO {
  id: string
  amount: number | null
  currency_code: string | null
  min_quantity: number | null
  max_quantity: number | null
}

/**
 * @interface
 * 
 * The rules to add to a price set.
 * 
 * @prop priceSetId - The ID of the price set to add the rules to.
 * @prop rules - The rules to add to a price set. The value of `attribute` is the value of the rule's `rule_attribute` attribute.
 */
export interface AddRulesDTO {
  priceSetId: string
  rules: { attribute: string }[]
}

/**
 * @interface
 * 
 * The prices to create part of a price set.
 * 
 * @prop rules - The rules to add to the price. The object's keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
 */
export interface CreatePricesDTO extends CreateMoneyAmountDTO {
  rules: Record<string, string>
}

/**
 * @interface
 * 
 * The prices to add to a price set.
 * 
 * @prop priceSetId - The ID of the price set to add prices to.
 * @prop prices - The prices to add to the price set.
 */
export interface AddPricesDTO {
  priceSetId: string
  prices: CreatePricesDTO[]
}

/**
 * @interface
 * 
 * The rules to remove from a price set.
 * 
 * @prop id - The ID of the price set.
 * @prop rules - The rules to remove. Each string is the `rule_attribute` of a rule to remove.
 */
export interface RemovePriceSetRulesDTO {
  id: string
  rules: string[]
}

/**
 * @interface
 * 
 * A price set to create.
 * 
 * @prop rules - The rules to associate with the price set. The value of `attribute` is the value of the rule's `rule_attribute` attribute.
 * @prop prices -The prices to create and add to this price set.
 */
export interface CreatePriceSetDTO {
  rules?: { rule_attribute: string }[]
  prices?: CreatePricesDTO[]
}

/**
 * @interface
 * 
 * The data to update in a price set. The `id` is used to identify which price set to update.
 * 
 * @prop id - A string indicating the ID of the price set to update.
 */
export interface UpdatePriceSetDTO {
  id: string
}

/**
 * @interface
 * 
 * Filters to apply on price sets.
 * 
 * @prop id - IDs to filter price sets by.
 * @prop money_amounts - Filters to apply on a price set's associated money amounts.
 */
export interface FilterablePriceSetProps
  extends BaseFilterable<FilterablePriceSetProps> {
  id?: string[]
  money_amounts?: FilterableMoneyAmountProps
}
