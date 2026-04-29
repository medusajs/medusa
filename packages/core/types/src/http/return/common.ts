import { ReturnStatus } from "../../order"

export interface BaseReturnItem {
  /**
   * The return item's ID.
   */
  id: string
  /**
   * The quantity of the item that is to be returned.
   */
  quantity: number
  /**
   * The quantity of the item that has been received.
   */
  received_quantity: number
  /**
   * The quantity of the item that has been received and is damaged.
   * This quantity is not added back to the quantity in the stock location.
   */
  damaged_quantity: number
  /**
   * The ID of the associated return reason.
   */
  reason_id?: string
  /**
   * A note to describe why the item is being returned.
   */
  note?: string
  /**
   * The ID of the order item that is being returned.
   */
  item_id: string
  /**
   * The ID of the return that the item belongs to.
   */
  return_id: string
  /**
   * Custom key-value pairs that can be added to the return item.
   */
  metadata?: Record<string, unknown>
}

export interface BaseReturn {
  /**
   * The return's ID.
   */
  id: string
  /**
   * The ID of the order that the return belongs to.
   */
  order_id: string
  /**
   * The return's status.
   */
  status?: ReturnStatus
  /**
   * The ID of the exchange that the return belongs to,
   * if available.
   */
  exchange_id?: string
  /**
   * The ID of the stock location that the items are returned to.
   */
  location_id?: string
  /**
   * The ID of the claim that the return belongs to,
   * if available.
   */
  claim_id?: string
  /**
   * The order's version once the return is applied.
   */
  order_version: number
  /**
   * The display ID of the return.
   */
  display_id: number
  /**
   * Whether to send the customers notifications about
   * return updates.
   */
  no_notification?: boolean
  /**
   * The amount that is to be refunded to the customer.
   */
  refund_amount?: number
  /**
   * The return's items.
   */
  items: BaseReturnItem[]
  /**
   * The date when the return was received.
   */
  received_at: string
  /**
   * The date when the return was created.
   */
  created_at: string
  /**
   * The ID of the user that created the return.
   */
  created_by: string
  /**
   * The date when the return was canceled.
   */
  canceled_at: string
  requested_at: string
}
