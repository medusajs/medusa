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
 * Used to specify the context to calculate prices. For example, you can specify the currency code to calculate prices in.
 * 
 * @prop context - 
 * an object whose keys are the name of the context attribute. Its value can be a string or a number. For example, you can pass the `currency_code` property with its value being the currency code to calculate the price in.
 * Another example is passing the `quantity` property to calculate the price for that specified quantity, which finds a price set whose `min_quantity` and `max_quantity` conditions match the specified quantity.
 * 
 * @example
 * 
 * To calculate prices 
 */
export interface PricingContext {
  context?: Record<string, string | number>
}

/**
 * @interface
 * 
 * Used to filter prices when calculating them.
 * 
 * @prop id - An array of strings, each being an ID of a price set.
 */
export interface PricingFilters {
  id: string[]
}

/**
 * @interface
 * 
 * An object that holds the details of a retrieved price set.
 * 
 * @prop id - A string indicating the ID of the price set.
 * @prop money_amounts - An array of objects of type {@link MoneyAmountDTO}, which holds the prices that belong to this price set.
 * @prop rule_types - An array of objects of type {@link RuleTypeDTO}, which holds the rule types applied on this price set.
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
 * An object that holds the details of a calculated price set.
 * 
 * @prop id - a string indicating the ID of the price set.
 * @prop amount - a number indicating the calculated amount. It can possibly be `null` if there's no price set up for the provided context.
 * @prop currency_code - a string indicating the currency code of the calculated price. It can possibly be `null`.
 * @prop min_quantity - a number indicaitng the minimum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
 * @prop max_quantity - a number indicaitng the maximum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.
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
 * An object used to specify the rules to add to a price set.
 * 
 * @prop priceSetId - A string indicating the ID of the price set to add the rules to.
 * @prop rules - An array of objects, each object holds a property `attribute`, with its value being the `rule_attribute` of the rule to add to the price set.
 */
export interface AddRulesDTO {
  priceSetId: string
  rules: { attribute: string }[]
}

/**
 * @interface
 * 
 * An object used to pass prices data when creating a price set.
 * 
 * @prop rules - An object whose keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.
 */
export interface CreatePricesDTO extends CreateMoneyAmountDTO {
  rules: Record<string, string>
}

/**
 * @interface
 * 
 * An object used to specify prices to add to a price set.
 * 
 * @prop priceSetId - A string indicating the ID of the price set to add prices to.
 * @prop prices - An array of objects of type {@link CreatePricesDTO}, each being a price to add to the price set.
 */
export interface AddPricesDTO {
  priceSetId: string
  prices: CreatePricesDTO[]
}

/**
 * @interface
 * 
 * An object of expected properties when removing a price set's rules.
 * 
 * @prop id - A string indicating the ID of the price set.
 * @prop rules - An array of strings, each string is the `rule_attribute` of a rule you want to remove.
 */
export interface RemovePriceSetRulesDTO {
  id: string
  rules: string[]
}

/**
 * @interface
 * 
 * An object of expected properties when creating a price set.
 * 
 * @prop rules - 
 * An array of objects, each object accepts a property `rule_attribute`, whose value is a string indicating the `rule_attribute` value of a rule type. 
 * This property is used to specify the rule types associated with the price set.
 * @prop prices - An array of objects of type {@link CreatePricesDTO}, each being a price to associate with the price set.
 */
export interface CreatePriceSetDTO {
  rules?: { rule_attribute: string }[]
  prices?: CreatePricesDTO[]
}

/**
 * @interface
 * 
 * An object of expected properties when updating a price set.
 * 
 * @prop id - A string indicating the ID of the price set to update.
 */
export interface UpdatePriceSetDTO {
  id: string
}

/**
 * @interface
 * 
 * An object that can be used to specify filters on price sets.
 * 
 * @prop id - An array of strings, each being an ID to filter price sets.
 * @prop money_amounts - An object of type {@link FilterableMoneyAmountProps} that is used to filter the price sets by their associated money amounts.
 */
export interface FilterablePriceSetProps
  extends BaseFilterable<FilterablePriceSetProps> {
  id?: string[]
  money_amounts?: FilterableMoneyAmountProps
}
