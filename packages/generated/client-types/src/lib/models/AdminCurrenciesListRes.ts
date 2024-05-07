/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Currency } from "./Currency"

/**
 * List of currencies with pagination fields.
 */
export interface AdminCurrenciesListRes {
  /**
   * An array of currency details.
   */
  currencies: Array<Currency>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of currencies skipped when retrieving the currencies.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
