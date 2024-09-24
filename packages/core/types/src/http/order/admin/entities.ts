import { AdminClaim } from "../../claim"
import { AdminCustomer } from "../../customer"
import { AdminExchange } from "../../exchange"
import { AdminPaymentCollection } from "../../payment/admin"
import { AdminProductVariant } from "../../product"
import { AdminRegionCountry } from "../../region"
import { AdminReturn } from "../../return"
import { AdminSalesChannel } from "../../sales-channel"
import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderChange,
  BaseOrderChangeAction,
  BaseOrderFulfillment,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "../common"

export interface AdminOrder extends Omit<BaseOrder, "items"> {
  payment_collections: AdminPaymentCollection[]
  fulfillments?: AdminOrderFulfillment[]
  sales_channel?: AdminSalesChannel
  customer?: AdminCustomer
  shipping_address?: AdminOrderAddress | null
  billing_address?: AdminOrderAddress | null
  items: AdminOrderLineItem[]
}

export interface AdminOrderLineItem extends BaseOrderLineItem {
  variant?: AdminProductVariant
}
export interface AdminOrderChange extends BaseOrderChange {
  order: AdminOrder
  claim: AdminClaim
  return_order: AdminReturn
  exchange: AdminExchange
  actions: AdminOrderChangeAction[]
}

export interface AdminOrderChangeAction extends BaseOrderChangeAction {
  order_change: AdminOrderChange
}

export interface AdminOrderFulfillment extends BaseOrderFulfillment {}

export interface AdminOrderLineItem extends BaseOrderLineItem {}

export interface AdminOrderAddress extends BaseOrderAddress {
  country?: AdminRegionCountry
}

export interface AdminOrderShippingMethod extends BaseOrderShippingMethod {}

export interface AdminOrderPreview
  extends Omit<AdminOrder, "items" | "shipping_methods"> {
  return_requested_total: number
  order_change: AdminOrderChange
  items: (AdminOrderLineItem & { actions?: AdminOrderChangeAction[] })[]
  shipping_methods: (AdminOrderShippingMethod & {
    actions?: AdminOrderChangeAction[]
  })[]
}
