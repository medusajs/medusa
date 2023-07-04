/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Currency
 */
export interface Currency {
  /**
   * The 3 character ISO code for the currency.
   */
  code: string
  /**
   * The symbol used to indicate the currency.
   */
  symbol: string
  /**
   * The native symbol used to indicate the currency.
   */
  symbol_native: string
  /**
   * The written name of the currency
   */
  name: string
  /**
   * [EXPERIMENTAL] Does the currency prices include tax
   */
  includes_tax?: boolean
}
