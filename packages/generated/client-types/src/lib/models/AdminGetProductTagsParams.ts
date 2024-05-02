/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductTagsParams {
  /**
   * Limit the number of product tags returned.
   */
  limit?: number
  /**
   * The number of product tags to skip when retrieving the product tags.
   */
  offset?: number
  /**
   * A product tag field to sort-order the retrieved product tags by.
   */
  order?: string
  /**
   * Filter by the ID of a discount condition. Only product tags that this discount condition is applied to will be retrieved.
   */
  discount_condition_id?: string
  /**
   * Filter by tag value.
   */
  value?: Array<string>
  /**
   * term to search product tags' values.
   */
  q?: string
  /**
   * Filter by tag IDs.
   */
  id?: Array<string>
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
