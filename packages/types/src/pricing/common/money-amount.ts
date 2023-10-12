import { BaseFilterable } from "../../dal"
import { CreateCurrencyDTO, CurrencyDTO } from "./currency"

/**
 * @interface
 * 
 * An object that holds prices, which typically belong to a price set.
 * 
 * @prop id - A string that indicates the ID of the money amount. A money amount represents a price.
 * @prop currency_code - A string that indicates the currency code of this price.
 * @prop currency - An object of type {@link CurrencyDTO} that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
 * @prop amount - A number indicating the amount of this price.
 * @prop min_quantity - A number that indicates the minimum quantity required to be purchased for this price to be applied.
 * @prop max_quantity - A number that indicates the maximum quantity required to be purchased for this price to be applied.
 */
export interface MoneyAmountDTO {
  id: string
  currency_code?: string
  currency?: CurrencyDTO
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

/**
 *  * @interface
 * 
 * An object that holds data to create a money amount.
 * 
 * @prop id - A string that indicates the ID of the money amount.
 * @prop currency_code - A string that indicates the currency code of this money amount.
 * @prop currency - An object of type {@link CurrencyDTO} that holds the details of the money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
 * @prop amount - A number indicating the amount of this money amount.
 * @prop min_quantity - A number that indicates the minimum quantity required to be purchased for this money amount to be applied.
 * @prop max_quantity - A number that indicates the maximum quantity required to be purchased for this money amount to be applied.
 */
export interface CreateMoneyAmountDTO {
  id?: string
  currency_code: string
  currency?: CreateCurrencyDTO
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

/**
 *  * @interface
 * 
 * An object that holds data to update a money amount.
 * 
 * @prop id - A string that indicates the ID of the money amount to update.
 * @prop currency_code - A string that indicates the currency code of the money amount.
 * @prop currency - An object of type {@link CurrencyDTO} that holds the details of the money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
 * @prop amount - A number indicating the amount of this money amount.
 * @prop min_quantity - A number that indicates the minimum quantity required to be purchased for this money amount to be applied.
 * @prop max_quantity - A number that indicates the maximum quantity required to be purchased for this money amount to be applied.
 */
export interface UpdateMoneyAmountDTO {
  id: string
  currency_code?: string
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

/**
 * @interface
 * 
 * An object that can be used to filter money amounts.
 * 
 * @prop id - An array of strings, each being an ID to filter money amounts.
 * @prop currency_code - A string or an array of strings, each being a currency code to filter money amounts.
 */
export interface FilterableMoneyAmountProps
  extends BaseFilterable<FilterableMoneyAmountProps> {
  id?: string[]
  currency_code?: string | string[]
}
