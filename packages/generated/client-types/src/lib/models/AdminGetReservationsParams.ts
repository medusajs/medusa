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
