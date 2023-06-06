/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetReservationsParams {
  /**
   * Location ids to search for.
   */
  location_id?: Array<string>
  /**
   * Inventory Item ids to search for.
   */
  inventory_item_id?: Array<string>
  /**
   * Line Item ids to search for.
   */
  line_item_id?: Array<string>
  /**
   * Filter by reservation quantity
   */
  quantity?: {
    /**
     * filter by reservation quantity less than this number
     */
    lt?: number
    /**
     * filter by reservation quantity greater than this number
     */
    gt?: number
    /**
     * filter by reservation quantity less than or equal to this number
     */
    lte?: number
    /**
     * filter by reservation quantity greater than or equal to this number
     */
    gte?: number
  }
  /**
   * A param for search reservation descriptions
   */
  description?:
    | string
    | {
        /**
         * filter by reservation description containing search string.
         */
        contains?: string
        /**
         * filter by reservation description starting with search string.
         */
        starts_with?: string
        /**
         * filter by reservation description ending with search string.
         */
        ends_with?: string
      }
  /**
   * Date comparison for when resulting reservations were created.
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
   * How many Reservations to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of Reservations returned.
   */
  limit?: number
  /**
   * (Comma separated) Which fields should be expanded in the product category.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be included in the product category.
   */
  fields?: string
}
