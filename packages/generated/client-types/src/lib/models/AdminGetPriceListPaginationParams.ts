/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetPriceListPaginationParams {
  /**
   * The number of items to get
   */
  limit?: number
  /**
   * The offset at which to get items
   */
  offset?: number
  /**
   * (Comma separated) Which fields should be expanded in each item of the result.
   */
  expand?: string
  /**
   * field to order results by.
   */
  order?: string
  /**
   * ID to search for.
   */
  id?: string
  /**
   * query to search in price list description, price list name, and customer group name fields.
   */
  q?: string
  /**
   * Status to search for.
   */
  status?: Array<"active" | "draft">
  /**
   * price list name to search for.
   */
  name?: string
  /**
   * Customer Group IDs to search for.
   */
  customer_groups?: Array<string>
  /**
   * Type to search for.
   */
  type?: Array<"sale" | "override">
  /**
   * Date comparison for when resulting price lists were created.
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
   * Date comparison for when resulting price lists were updated.
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
   * Date comparison for when resulting price lists were deleted.
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
