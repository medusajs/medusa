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
   * Filter by a creation date range.
   */
  created_at?: {
    /**
     * filter by dates less than this date
     */
    lt?: string
    /**
     * filter by dates greater than this date
     */
    gt?: string
    /**
     * filter by dates less than or equal to this date
     */
    lte?: string
    /**
     * filter by dates greater than or equal to this date
     */
    gte?: string
  }
  /**
   * Filter by an update date range.
   */
  updated_at?: {
    /**
     * filter by dates less than this date
     */
    lt?: string
    /**
     * filter by dates greater than this date
     */
    gt?: string
    /**
     * filter by dates less than or equal to this date
     */
    lte?: string
    /**
     * filter by dates greater than or equal to this date
     */
    gte?: string
  }
  /**
   * Filter by a deletion date range.
   */
  deleted_at?: {
    /**
     * filter by dates less than this date
     */
    lt?: string
    /**
     * filter by dates greater than this date
     */
    gt?: string
    /**
     * filter by dates less than or equal to this date
     */
    lte?: string
    /**
     * filter by dates greater than or equal to this date
     */
    gte?: string
  }
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
   * Term used to search tax rates by name.
   */
  q?: string
  /**
   * A tax rate field to sort-order the retrieved tax rates by.
   */
  order?: string
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
