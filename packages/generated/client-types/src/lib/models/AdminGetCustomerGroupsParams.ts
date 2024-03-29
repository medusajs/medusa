/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetCustomerGroupsParams {
  /**
   * term to search customer groups by name.
   */
  q?: string
  /**
   * The number of customer groups to skip when retrieving the customer groups.
   */
  offset?: number
  /**
   * A field to sort order the retrieved customer groups by.
   */
  order?: string
  /**
   * Filter by discount condition ID.
   */
  discount_condition_id?: string
  /**
   * Filter by the customer group ID
   */
  id?:
    | string
    | Array<string>
    | {
        /**
         * filter by IDs less than this ID
         */
        lt?: string
        /**
         * filter by IDs greater than this ID
         */
        gt?: string
        /**
         * filter by IDs less than or equal to this ID
         */
        lte?: string
        /**
         * filter by IDs greater than or equal to this ID
         */
        gte?: string
      }
  /**
   * Filter by the customer group name
   */
  name?: Array<string>
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
   * The number of customer groups to return.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned customer groups.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned customer groups.
   */
  fields?: string
}
