/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetTaxRatesParams {
  /**
   * Name of tax rate to retrieve
   */
  name?: string
  /**
   * Filter by Region ID
   */
  region_id?: string | Array<string>
  /**
   * code to search for.
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
   * How many tax rates to skip before retrieving the result.
   */
  offset?: number
  /**
   * Limit the number of tax rates returned.
   */
  limit?: number
  /**
   * Which fields should be included in each item.
   */
  fields?: Array<string>
  /**
   * Which fields should be expanded and retrieved for each item.
   */
  expand?: Array<string>
}
