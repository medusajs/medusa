import { BaseFilterable } from "../../dal"
import { CreateCurrencyDTO, CurrencyDTO } from "./currency"

/**
 * @interface
 * 
 * A money amount's data. A money amount represents a price.
 * 
 * @prop id - The ID of the money amount.
 * @prop currency_code - The currency code of this money amount.
 * @prop currency - The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.
 * @prop amount - The price of this money amount.
 * @prop min_quantity - The minimum quantity required to be purchased for this price to be applied.
 * @prop max_quantity - The maximum quantity required to be purchased for this price to be applied.
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
 * @interface
 * 
 * The money amount to create.
 * 
 * @prop id - The ID of the money amount.
 * @prop currency_code - The currency code of this money amount.
 * @prop currency - The currency of this money amount.
 * @prop amount - The amount of this money amount.
 * @prop min_quantity - The minimum quantity required to be purchased for this money amount to be applied.
 * @prop max_quantity - The maximum quantity required to be purchased for this money amount to be applied.
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
 * The data to update in a money amount. The `id` is used to identify which money amount to update.
 * 
 * @prop id - The ID of the money amount to update.
 * @prop currency_code - The code of the currency to associate with the money amount.
 * @prop currency - The currency to associte with the money amount.
 * @prop amount - The price of this money amount.
 * @prop min_quantity - The minimum quantity required to be purchased for this money amount to be applied.
 * @prop max_quantity - The maximum quantity required to be purchased for this money amount to be applied.
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
 * Filters to apply on a money amount.
 * 
 * @prop id - IDs to filter money amounts by.
 * @prop currency_code - Currency codes to filter money amounts by.
 */
export interface FilterableMoneyAmountProps
  extends BaseFilterable<FilterableMoneyAmountProps> {
  id?: string[]
  currency_code?: string | string[]
}
