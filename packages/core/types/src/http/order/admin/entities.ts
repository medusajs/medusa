import { AdminPaymentCollection } from "../../payment/admin"
import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderChange,
  BaseOrderChangeAction,
  BaseOrderFulfillment,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "../common"

export interface AdminOrder extends BaseOrder {
  payment_collections: AdminPaymentCollection[]
  fulfillments?: BaseOrderFulfillment[]
}

export interface AdminOrderChange extends BaseOrderChange {}

export interface AdminOrderLineItem extends BaseOrderLineItem {}

export interface AdminOrderFulfillment extends BaseOrderFulfillment {}

export interface AdminOrderLineItem extends BaseOrderLineItem {}
export interface AdminOrderAddress extends BaseOrderAddress {}
export interface AdminOrderShippingMethod extends BaseOrderShippingMethod {}
export interface AdminOrderPreview
  extends Omit<AdminOrder, "items" | "shipping_methods"> {
  return_requested_total: number
  order_change: BaseOrderChange
  items: (BaseOrderLineItem & { actions?: BaseOrderChangeAction[] })[]
  shipping_methods: (BaseOrderShippingMethod & {
    actions?: BaseOrderChangeAction[]
  })[]
}
