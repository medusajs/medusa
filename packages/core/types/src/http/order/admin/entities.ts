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
  /**
   * The order's details.
   */
  order: AdminOrder
  /**
   * The claim's details.
   */
  claim: AdminClaim
  /**
   * The return's details.
   */
  return_order: AdminReturn
  /**
   * The exchange's details.
   */
  exchange: AdminExchange
  /**
   * The order change action's details.
   */
  actions: AdminOrderChangeAction[]
}

export interface AdminOrderChangeAction
  extends Omit<BaseOrderChangeAction, "order_change" | "order"> {
  /**
   * The order change's details.
   */
  order_change: AdminOrderChange
  /**
   * The order's details.
   */
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
  /**
   * The total amount for the items requested to be returned.
   */
  return_requested_total: number
  /**
   * The details of the changes on the order.
   */
  order_change: AdminOrderChange
  /**
   * The order's items.
   */
  items: (AdminOrderLineItem & { actions?: AdminOrderChangeAction[] })[]
  /**
   * The order's shipping methods.
   */
  shipping_methods: (AdminOrderShippingMethod & {
    actions?: AdminOrderChangeAction[]
  })[]
}
