/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetStockLocationsParams {
  /**
   * Filter by ID.
   */
  id?: string
  /**
   * Filter by name.
   */
  name?: string
  /**
   * A stock-location field to sort-order the retrieved stock locations by.
   */
  order?: string
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
   * The number of stock locations to skip when retrieving the stock locations.
   */
  offset?: number
  /**
   * Limit the number of stock locations returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned stock locations.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned stock locations.
   */
  fields?: string
}
