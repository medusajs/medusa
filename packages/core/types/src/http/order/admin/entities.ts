import { AdminClaim } from "../../claim"
import { AdminCustomer } from "../../customer"
import { AdminExchange } from "../../exchange"
import { AdminPaymentCollection } from "../../payment/admin"
import { AdminProduct, AdminProductVariant } from "../../product"
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
  shipping_methods: AdminOrderShippingMethod[]
}

export interface AdminOrderChange
  extends Omit<
    BaseOrderChange,
    "order" | "claim" | "return_order" | "exchange" | "actions"
  > {
  order: AdminOrder
  claim: AdminClaim
  return_order: AdminReturn
  exchange: AdminExchange
  actions: AdminOrderChangeAction[]
}

export interface AdminOrderItem {
  order_id: string
  item_id: string
  version: number
  history: {
    version: {
      from: number
      to: number
    }
  }
  item: AdminOrderLineItem
}

export interface AdminOrderChangeAction
  extends Omit<BaseOrderChangeAction, "order_change" | "order"> {
  order_change: AdminOrderChange
  order: AdminOrder | null
}

export interface AdminOrderFulfillment extends BaseOrderFulfillment {}

export interface AdminOrderItem {
  order_id: string
  item_id: string
  version: number
  history: {
    version: {
      from: number
      to: number
    }
  }
  item: AdminOrderLineItem
}

export interface AdminOrderLineItem
  extends Omit<BaseOrderLineItem, "variant" | "product"> {
  variant?: AdminProductVariant
  product?: AdminProduct
}

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
