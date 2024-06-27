import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderFilters,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "./common"

export interface AdminOrder extends BaseOrder {}
export interface AdminOrderLineItem extends BaseOrderLineItem {}
export interface AdminOrderFilters extends BaseOrderFilters {}
export interface AdminOrderAddress extends BaseOrderAddress {}
export interface AdminOrderShippingMethod extends BaseOrderShippingMethod {}

export interface AdminOrderResponse {
  order: AdminOrder
}

export interface AdminOrdersResponse {
  orders: AdminOrder[]
}

export interface AdminCreateOrderFulfillment {
  items: { id: string; quantity: number }[]
  location_id?: string
  no_notification?: boolean
  metadata?: Record<string, any>
}

export interface AdminCreateOrderReturn {
  order_id: string
  items: {
    id: string
    quantity: number
    reason_id?: string
    note?: string
  }[]
  return_shipping: { option_id: string; price?: number }
  internal_note?: string
  receive_now?: boolean
  refund_amount?: number
  location_id?: string
}

export interface AdminCancelOrderFulfillment {
  no_notification?: boolean
}
