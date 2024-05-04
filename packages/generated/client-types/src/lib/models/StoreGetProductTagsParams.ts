/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductTagsParams {
  /**
   * Limit the number of product tags returned.
   */
  limit?: number
  /**
   * The number of product tags to skip when retrieving the product tags.
   */
  offset?: number
  /**
   * A product-tag field to sort-order the retrieved product tags by.
   */
  order?: string
  /**
   * Filter by the ID of a discount condition. When provided, only tags that the discount condition applies for will be retrieved.
   */
  discount_condition_id?: string
  /**
   * Filter by tag values.
   */
  value?: Array<string>
  /**
   * Filter by IDs.
   */
  id?: Array<string>
  /**
   * term to search product tag's value.
   */
  q?: string
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
}
