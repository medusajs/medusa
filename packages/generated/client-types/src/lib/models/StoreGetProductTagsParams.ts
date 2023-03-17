/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductTagsParams {
  /**
   * The number of types to return.
   */
  limit?: number
  /**
   * The number of items to skip before the results.
   */
  offset?: number
  /**
   * The field to sort items by.
   */
  order?: string
  /**
   * The discount condition id on which to filter the product tags.
   */
  discount_condition_id?: string
  /**
   * The tag values to search for
   */
  value?: Array<string>
  /**
   * The tag IDs to search for
   */
  id?: Array<string>
  /**
   * A query string to search values for
   */
  q?: string
  /**
   * Date comparison for when resulting product tags were created.
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
   * Date comparison for when resulting product tags were updated.
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
