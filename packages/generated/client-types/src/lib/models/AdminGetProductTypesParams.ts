/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductTypesParams {
  /**
   * Limit the number of product types returned.
   */
  limit?: number
  /**
   * The number of product types to skip when retrieving the product types.
   */
  offset?: number
  /**
   * A product type field to sort-order the retrieved product types by.
   */
  order?: string
  /**
   * Filter by the ID of a discount condition. Only product types that this discount condition is applied to will be retrieved.
   */
  discount_condition_id?: string
  /**
   * Filter by value.
   */
  value?: Array<string>
  /**
   * Filter by product type IDs.
   */
  id?: Array<string>
  /**
   * term to search product types' values.
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
