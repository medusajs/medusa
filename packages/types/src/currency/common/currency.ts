import { BaseFilterable } from "../../dal"

/**
 * @interface
 *
 * A currency's data.
 */
export interface CurrencyDTO {
  /**
   * The ISO 3 code of the currency.
   */
  code: string
  /**
   * The symbol of the currency.
   */
  symbol: string
  /**
   * The symbol of the currecy in its native form. This is typically the symbol used when displaying a price.
   */
  symbol_native: string
  /**
   * The name of the currency.
   */
  name: string
}

/**
 * @interface
 *
 * Filters to apply on a currency.
 */
export interface FilterableCurrencyProps
  extends BaseFilterable<FilterableCurrencyProps> {
  /**
   * The codes to filter the currencies by.
   */
  code?: string[]
}
