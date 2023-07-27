/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetSalesChannelsParams {
  /**
   * Filter by a sales channel ID.
   */
  id?: string
  /**
   * Filter by name.
   */
  name?: string
  /**
   * Filter by description.
   */
  description?: string
  /**
   * term used to search sales channels' names and descriptions.
   */
  q?: string
  /**
   * A sales-channel field to sort-order the retrieved sales channels by.
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
   * The number of sales channels to skip when retrieving the sales channels.
   */
  offset?: number
  /**
   * Limit the number of sales channels returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned sales channels.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned sales channels.
   */
  fields?: string
}
