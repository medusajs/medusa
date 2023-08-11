/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetReservationsParams {
  /**
   * Filter by location ID
   */
  location_id?: Array<string>
  /**
   * Filter by inventory item ID.
   */
  inventory_item_id?: Array<string>
  /**
   * Filter by line item ID.
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
   * Filter by description.
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
   * The number of reservations to skip when retrieving the reservations.
   */
  offset?: number
  /**
   * Limit the number of reservations returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned reservations.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned reservations.
   */
  fields?: string
}
