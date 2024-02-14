/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetOrdersParams {
  /**
   * term to search orders' shipping address, first name, email, and display ID
   */
  q?: string
  /**
   * Filter by ID.
   */
  id?: string
  /**
   * Filter by status
   */
  status?: Array<
    "pending" | "completed" | "archived" | "canceled" | "requires_action"
  >
  /**
   * Filter by fulfillment status
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
   * Filter by payment status
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
   * Filter by display ID
   */
  display_id?: string
  /**
   * Filter by cart ID
   */
  cart_id?: string
  /**
   * Filter by customer ID
   */
  customer_id?: string
  /**
   * Filter by email
   */
  email?: string
  /**
   * Filter by region IDs.
   */
  region_id?: string | Array<string>
  /**
   * Filter by currency codes.
   */
  currency_code?: string
  /**
   * Filter by tax rate.
   */
  tax_rate?: string
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
   * Filter by a cancelation date range.
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
   * Filter by Sales Channel IDs
   */
  sales_channel_id?: Array<string>
  /**
   * The number of orders to skip when retrieving the orders.
   */
  offset?: number
  /**
   * Limit the number of orders returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned order.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned order.
   */
  fields?: string
  /**
   * Field to sort retrieved orders by.
   */
  order?: string
}
