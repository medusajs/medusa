/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetCustomerGroupsParams {
  /**
   * Query used for searching customer group names.
   */
  q?: string
  /**
   * How many groups to skip in the result.
   */
  offset?: number
  /**
   * the field used to order the customer groups.
   */
  order?: string
  /**
   * The discount condition id on which to filter the customer groups.
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
   * Date comparison for when resulting customer groups were created.
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
   * Date comparison for when resulting customer groups were updated.
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
   * Limit the number of customer groups returned.
   */
  limit?: number
  /**
   * (Comma separated) Which fields should be expanded in each customer groups of the result.
   */
  expand?: string
}
