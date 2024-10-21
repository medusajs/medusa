import { OperatorMap } from "../../dal"
import { FindParams } from "../common"
import {
  BaseOrder,
  BaseOrderShippingMethod,
  BaseOrderTransaction,
} from "../order/common"
import { AdminReturn, AdminReturnItem } from "../return"

export interface BaseExchangeItem {
  /**
   * The exchange item's ID.
   */
  id: string
  /**
   * The ID of the exchange this item belongs to.
   */
  exchange_id: string
  /**
   * The ID of the associated order.
   */
  order_id: string
  /**
   * The ID of the order item, which is added
   * to the order when the exchange is confirmed.
   */
  item_id: string
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
  /**
   * The date the exchange item was created.
   */
  created_at: string | null
  /**
   * The date the exchange item was updated.
   */
  updated_at: string | null
}

export interface BaseExchange {
  /**
   * The exchange's ID.
   */
  id: string
  /**
   * The ID of the order this exchange is created for.
   */
  order_id: string
  /**
   * The ID of the associated return.
   */
  return_id?: string
  /**
   * The exchange's display ID.
   */
  display_id?: string
  /**
   * The version of the order when the exchange is applied.
   */
  order_version?: string
  /**
   * The ID of the user that created the exchange.
   */
  created_by?: string
  /**
   * The date the exchange was created.
   */
  created_at: Date | string
  /**
   * The date the exchange was updated.
   */
  updated_at: Date | string
  /**
   * The date the exchange was canceled.
   */
  canceled_at: Date | string
  /**
   * The date the exchange was deleted.
   */
  deleted_at: Date | string
  /**
   * The exchange's new (outbound) items.
   */
  additional_items: BaseExchangeItem[]
  /**
   * The exchange's returned (inbound) items.
   */
  return_items: AdminReturnItem[]
  /**
   * Whether to notify the customer about changes in the exchange.
   */
  no_notification?: boolean
  /**
   * The exchange's difference amount due, either to the customer or the merchant.
   * 
   * If the value is positive, the customer owes the merchant additional payment of this amount.
   * If negative, the merchant owes the customer a refund of this amount.
   */
  difference_due?: number
  /**
   * The associated return.
   */
  return?: AdminReturn
  /**
   * The associated order.
   */
  order?: BaseOrder
  /**
   * Whether out-of-stock variants can be added as new items.
   */
  allow_backorder?: boolean
  /**
   * The shipping methods used to send the outbound items.
   */
  shipping_methods?: BaseOrderShippingMethod[]
  /**
   * The exchange's transactions.
   */
  transactions?: BaseOrderTransaction[]
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
}

export interface BaseExchangeListParams extends FindParams {
  /**
   * Query or keywords to search the exchange's searchable fields.
   */
  q?: string
  /**
   * Filter by exchange ID(s).
   */
  id?: string | string[]
  /**
   * Filter by order IDs to retrieve their exchanges.
   */
  order_id?: string | string[]
  /**
   * Filter by status(es).
   */
  status?: string | string[]
  /**
   * Apply filters on the exchange's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the exchange's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the exchange's deletion date.
   */
  deleted_at?: OperatorMap<string>
}
