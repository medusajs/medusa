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

export interface CreateCurrencyDTO {
  code: string
  symbol: string
  symbol_native: string
  name: string
}

export interface UpdateCurrencyDTO {
  code: string
  symbol?: string
  symbol_native?: string
  name?: string
}

export interface FilterableCurrencyProps
  extends BaseFilterable<FilterableCurrencyProps> {
  code?: string[]
}
