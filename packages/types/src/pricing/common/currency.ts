import { BaseFilterable } from "../../dal"

/**
 * @interface
 * 
 * An object representing a currency.
 * 
 * @prop code - a string indicating the code of the currency.
 * @prop symbol - a string indicating the symbol of the currency.
 * @prop symbol_native - 
 * a string indicating the symbol of the currecy in its native form.
 * This is typically the symbol used when displaying a price.
 * @prop name - a string indicating the name of the currency.
 */
export interface CurrencyDTO {
  code: string
  symbol?: string
  symbol_native?: string
  name?: string
}

/**
 * @interface
 * 
 * An object that holds data to create a currency.
 * 
 * @prop code - a string indicating the code of the currency.
 * @prop symbol - a string indicating the symbol of the currency.
 * @prop symbol_native - 
 * a string indicating the symbol of the currecy in its native form.
 * This is typically the symbol used when displaying a price.
 * @prop name - a string indicating the name of the currency.
 */
export interface CreateCurrencyDTO {
  code: string
  symbol: string
  symbol_native: string
  name: string
}

/**
 * @interface
 * 
 * An object that holds data to update a currency. The currency code must be provided to identify which currency to update.
 * 
 * @prop code - a string indicating the code of the currency to update.
 * @prop symbol - a string indicating the symbol of the currency.
 * @prop symbol_native - 
 * a string indicating the symbol of the currecy in its native form.
 * This is typically the symbol used when displaying a price.
 * @prop name - a string indicating the name of the currency.
 */
export interface UpdateCurrencyDTO {
  code: string
  symbol?: string
  symbol_native?: string
  name?: string
}

/**
 * @interface
 * 
 * An object used to filter retrieved currencies.
 * 
 * @prop code - an array of strings, each being a currency code to filter the currencies.
 */
export interface FilterableCurrencyProps
  extends BaseFilterable<FilterableCurrencyProps> {
  code?: string[]
}
