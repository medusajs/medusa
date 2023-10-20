import { BaseFilterable } from "../../dal"

/**
 * @interface
 * 
 * A currency's data.
 * 
 * @prop code - The code of the currency.
 * @prop symbol - The symbol of the currency.
 * @prop symbol_native - 
 * The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
 * @prop name - The name of the currency.
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
 * A currency to create.
 * 
 * @prop code - The code of the currency.
 * @prop symbol - The symbol of the currency.
 * @prop symbol_native - 
 * The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
 * @prop name - The name of the currency.
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
 * The data to update in a currency. The `code` is used to identify which currency to update.
 * 
 * @prop code - The code of the currency to update.
 * @prop symbol - The symbol of the currency.
 * @prop symbol_native - 
 * The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
 * @prop name - The name of the currency.
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
 * Filters to apply on a currency.
 * 
 * @prop code - The codes to filter the currencies by.
 */
export interface FilterableCurrencyProps
  extends BaseFilterable<FilterableCurrencyProps> {
  code?: string[]
}
