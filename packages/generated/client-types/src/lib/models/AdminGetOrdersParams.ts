/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetOrdersParams {
  /**
   * Query used for searching orders by shipping address first name, orders' email, and orders' display ID
   */
  q?: string
  /**
   * ID of the order to search for.
   */
  id?: string
  /**
   * Status to search for
   */
  status?: Array<
    "pending" | "completed" | "archived" | "canceled" | "requires_action"
  >
  /**
   * Fulfillment status to search for.
   */
  fulfillment_status?: Array<
    | "not_fulfilled"
    | "fulfilled"
    | "partially_fulfilled"
    | "shipped"
    | "partially_shipped"
    | "canceled"
    | "returned"
    | "partially_returned"
    | "requires_action"
  >
  /**
   * Payment status to search for.
   */
  payment_status?: Array<
    | "captured"
    | "awaiting"
    | "not_paid"
    | "refunded"
    | "partially_refunded"
    | "canceled"
    | "requires_action"
  >
  /**
   * Display ID to search for.
   */
  display_id?: string
  /**
   * to search for.
   */
  cart_id?: string
  /**
   * to search for.
   */
  customer_id?: string
  /**
   * to search for.
   */
  email?: string
  /**
   * Regions to search orders by
   */
  region_id?: string | Array<string>
  /**
   * Currency code to search for
   */
  currency_code?: string
  /**
   * to search for.
   */
  tax_rate?: string
  /**
   * Date comparison for when resulting orders were created.
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
   * Date comparison for when resulting orders were updated.
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
   * Date comparison for when resulting orders were canceled.
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
   * Filter by Sales Channels
   */
  sales_channel_id?: Array<string>
  /**
   * How many orders to skip before the results.
   */
  offset?: number
  /**
   * Limit the number of orders returned.
   */
  limit?: number
  /**
   * (Comma separated) Which fields should be expanded in each order of the result.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be included in each order of the result.
   */
  fields?: string
}
