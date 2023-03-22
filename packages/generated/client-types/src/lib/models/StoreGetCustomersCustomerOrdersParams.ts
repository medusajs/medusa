/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetCustomersCustomerOrdersParams {
  /**
   * Query used for searching orders.
   */
  q?: string
  /**
   * Id of the order to search for.
   */
  id?: string
  /**
   * Status to search for.
   */
  status?: Array<string>
  /**
   * Fulfillment status to search for.
   */
  fulfillment_status?: Array<string>
  /**
   * Payment status to search for.
   */
  payment_status?: Array<string>
  /**
   * Display id to search for.
   */
  display_id?: string
  /**
   * to search for.
   */
  cart_id?: string
  /**
   * to search for.
   */
  email?: string
  /**
   * to search for.
   */
  region_id?: string
  /**
   * The 3 character ISO currency code to set prices based on.
   */
  currency_code?: string
  /**
   * to search for.
   */
  tax_rate?: string
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
   * Date comparison for when resulting collections were canceled.
   */
  canceled_at?: {
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
   * How many orders to return.
   */
  limit?: number
  /**
   * The offset in the resulting orders.
   */
  offset?: number
  /**
   * (Comma separated string) Which fields should be included in the resulting orders.
   */
  fields?: string
  /**
   * (Comma separated string) Which relations should be expanded in the resulting orders.
   */
  expand?: string
}
