export interface BaseCurrency {
  /**
   * The currency's code.
   *
   * @example
   * usd
   */
  code: string
  /**
   * The currency's symbol.
   *
   * @example
   * $
   */
  symbol: string
  /**
   * The currency's symbol in its native language or country.
   *
   * @example
   * $
   */
  symbol_native: string
  /**
   * The currency's name.
   */
  name: string
  /**
   * The number of digits after the decimal for prices in this currency.
   */
  decimal_digits: number
  /**
   * The rounding percision applied on prices in this currency.
   */
  rounding: number
  /**
   * The date the currency was created.
   */
  created_at: string
  /**
   * The date the currency was updated.
   */
  updated_at: string
  /**
   * The date the currency was deleted.
   */
  deleted_at: string | null
}
