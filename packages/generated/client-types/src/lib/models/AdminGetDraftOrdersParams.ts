/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetDraftOrdersParams {
  /**
   * The number of draft orders to skip when retrieving the draft orders.
   */
  offset?: number
  /**
   * Limit the number of draft orders returned.
   */
  limit?: number
  /**
   * a term to search draft orders' display IDs and emails in the draft order's cart
   */
  q?: string
  /**
   * Field to sort retrieved draft orders by.
   */
  order?: string
  /**
   * A comma-separated list of fields to expand.
   */
  expand?: string
  /**
   * A comma-separated list of fields to include in the response.
   */
  fields?: string
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
   * Filter by status
   */
  status?: Array<"open" | "completed">
}
