/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { TaxRate } from "./TaxRate"

/**
 * The list of tax rates with pagination fields.
 */
export interface AdminTaxRatesListRes {
  /**
   * An array of tax rate details.
   */
  tax_rates: Array<TaxRate>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of tax rates to skip when retrieving the tax rates.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
