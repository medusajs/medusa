/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetCustomersCustomerOrdersParams {
  /**
   * term to search orders' display ID, email, shipping address's first name, customer's first name, customer's last name, and customer's phone number.
   */
  q?: string
  /**
   * Filter by ID.
   */
  id?: string
  /**
   * Filter by status.
   */
  status?: Array<
    "pending" | "completed" | "archived" | "canceled" | "requires_action"
  >
  /**
   * Fulfillment status to search for.
   */
  fulfillment_status?: Array<
    | "not_fulfilled"
    | "partially_fulfilled"
    | "fulfilled"
    | "partially_shipped"
    | "shipped"
    | "partially_returned"
    | "returned"
    | "canceled"
    | "requires_action"
  >
  /**
   * Payment status to search for.
   */
  payment_status?: Array<
    | "not_paid"
    | "awaiting"
    | "captured"
    | "partially_refunded"
    | "refunded"
    | "canceled"
    | "requires_action"
  >
  /**
   * Filter by display ID.
   */
  display_id?: string
  /**
   * Filter by cart ID.
   */
  cart_id?: string
  /**
   * Filter by email.
   */
  email?: string
  /**
   * Filter by region ID.
   */
  region_id?: string
  /**
   * Filter by the 3 character ISO currency code of the order.
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
   * Limit the number of orders returned.
   */
  limit?: number
  /**
   * The number of orders to skip when retrieving the orders.
   */
  offset?: number
  /**
   * Comma-separated relations that should be expanded in the returned orders.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned orders.
   */
  fields?: string
}
