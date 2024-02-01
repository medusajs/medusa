/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetTaxRatesParams {
  /**
   * Filter by name.
   */
  name?: string
  /**
   * Filter by Region IDs
   */
  region_id?: string | Array<string>
  /**
   * Filter by code.
   */
  code?: string
  /**
   * Filter by Rate
   */
  rate?:
    | number
    | {
        /**
         * filter by rates less than this number
         */
        lt?: number
        /**
         * filter by rates greater than this number
         */
        gt?: number
        /**
         * filter by rates less than or equal to this number
         */
        lte?: number
        /**
         * filter by rates greater than or equal to this number
         */
        gte?: number
      }
  /**
   * The number of tax rates to skip when retrieving the tax rates.
   */
  offset?: number
  /**
   * Limit the number of tax rates returned.
   */
  limit?: number
  /**
   * Comma-separated fields that should be included in the returned tax rate.
   */
  fields?: Array<string>
  /**
   * Comma-separated relations that should be expanded in the returned tax rate.
   */
  expand?: Array<string>
}
