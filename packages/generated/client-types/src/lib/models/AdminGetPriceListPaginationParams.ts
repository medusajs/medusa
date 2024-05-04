/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetPriceListPaginationParams {
  /**
   * Limit the number of price lists returned.
   */
  limit?: number
  /**
   * The number of price lists to skip when retrieving the price lists.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in the returned price lists.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned price lists.
   */
  fields?: string
  /**
   * A price-list field to sort-order the retrieved price lists by.
   */
  order?: string
  /**
   * Filter by ID
   */
  id?: string
  /**
   * term to search price lists' description, name, and customer group's name.
   */
  q?: string
  /**
   * Filter by status.
   */
  status?: Array<"active" | "draft">
  /**
   * Filter by name
   */
  name?: string
  /**
   * Filter by customer-group IDs.
   */
  customer_groups?: Array<string>
  /**
   * Filter by type.
   */
  type?: Array<"sale" | "override">
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
}
