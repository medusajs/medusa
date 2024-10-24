import { OperatorMap } from "../../../dal"
import { FulfillmentStatus, PaymentStatus } from "../../../order"
import { FindParams } from "../../common"
import { BaseOrderChangesFilters, BaseOrderFilters } from "../common"

export interface AdminOrderFilters extends FindParams, BaseOrderFilters {
  /**
   * Filter by order ID(s).
   */
  id?: string[] | string
  /**
   * Filter by sales channel IDs to retrieve their associated orders.
   */
  sales_channel_id?: string[]
  /**
   * Filter by fulfillment statuses.
   */
  fulfillment_status?: FulfillmentStatus[]
  /**
   * Filter by payment statuses.
   */
  payment_status?: PaymentStatus[]
  /**
   * Filter by region IDs to retrieve their associated orders.
   */
  region_id?: string[]
  /**
   * Query or keywords to filter the order's searchable fields.
   */
  q?: string
  /**
   * Apply filters on the fulfillment's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the fulfillment's update date.
   */
  updated_at?: OperatorMap<string>
}

export interface AdminOrderItemsFilters extends FindParams {
  /**
   * Filter by order item ID(s).
   */
  id?: string[] | string
  /**
   * Filter by the associated line item ID(s).
   */
  item_id?: string[] | string
  /**
   * Filter by order version(s).
   */
  version?: number[] | number
}

export interface AdminOrderChangesFilters extends BaseOrderChangesFilters {}

export interface AdminOrderItemsFilters extends FindParams {
  id?: string[] | string
  item_id?: string[] | string
  order_id?: string[] | string
  version?: number[] | number
}
