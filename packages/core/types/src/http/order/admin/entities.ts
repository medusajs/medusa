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
  /**
   * The order's payment collections.
   */
  payment_collections: AdminPaymentCollection[]
  /**
   * The order's fulfillments.
   */
  fulfillments?: AdminOrderFulfillment[]
  /**
   * The associated sales channel's details.
   */
  sales_channel?: AdminSalesChannel
  /**
   * The details of the customer that placed the order.
   */
  customer?: AdminCustomer
  /**
   * The order's shipping address.
   */
  shipping_address?: AdminOrderAddress | null
  /**
   * The order's billing address.
   */
  billing_address?: AdminOrderAddress | null
  /**
   * The order's items.
   */
  items: AdminOrderLineItem[]
  /**
   * The order's shipping methods.
   */
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
  /**
   * The ID of the order that the item belongs to.
   */
  order_id: string
  /**
   * The ID of the associated line item.
   */
  item_id: string
  /**
   * The order version that the item belongs to.
   */
  version: number
  /**
   * The item's history details.
   */
  history: {
    /**
     * The item's version details.
     */
    version: {
      /**
       * The version it was added in.
       */
      from: number
      /**
       * The version it's still available in.
       */
      to: number
    }
  }
  /**
   * The associated line item's details.
   */
  item: AdminOrderLineItem
}

export interface AdminOrderLineItem
  extends Omit<BaseOrderLineItem, "variant" | "product"> {
  /**
   * The associated variant's details.
   */
  variant?: AdminProductVariant
  /**
   * The associated product's details.
   */
  product?: AdminProduct
}

export interface AdminOrderAddress extends BaseOrderAddress {
  /**
   * The address's country.
   */
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
