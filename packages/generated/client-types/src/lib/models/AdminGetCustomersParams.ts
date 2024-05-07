/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetCustomersParams {
  /**
   * The number of customers to return.
   */
  limit?: number
  /**
   * The number of customers to skip when retrieving the customers.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in the returned customers.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned customers.
   */
  fields?: string
  /**
   * term to search customers' email, first_name, and last_name fields.
   */
  q?: string
  /**
   * Filter customers by whether they have an account.
   */
  has_account?: boolean
  /**
   * A field to sort-order the retrieved customers by.
   */
  order?: string
  /**
   * Filter by customer group IDs.
   */
  groups?: Array<string>
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
