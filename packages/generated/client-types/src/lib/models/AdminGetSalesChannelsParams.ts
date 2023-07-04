/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetSalesChannelsParams {
  /**
   * ID of the sales channel
   */
  id?: string
  /**
   * Name of the sales channel
   */
  name?: string
  /**
   * Description of the sales channel
   */
  description?: string
  /**
   * Query used for searching sales channels' names and descriptions.
   */
  q?: string
  /**
   * The field to order the results by.
   */
  order?: string
  /**
   * Date comparison for when resulting collections were created.
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
   * Date comparison for when resulting collections were updated.
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
   * Date comparison for when resulting collections were deleted.
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
   * How many sales channels to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of sales channels returned.
   */
  limit?: number
  /**
   * (Comma separated) Which fields should be expanded in each sales channel of the result.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be included in each sales channel of the result.
   */
  fields?: string
}
