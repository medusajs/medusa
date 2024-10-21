import { StoreCustomer } from "../../customer"
import { StorePaymentCollection } from "../../payment"
import { StoreProduct, StoreProductVariant } from "../../product"
import { StoreRegionCountry } from "../../region"
import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderFulfillment,
  BaseOrderItemDetail,
  BaseOrderLineItem,
  BaseOrderLineItemAdjustment,
  BaseOrderLineItemTaxLine,
  BaseOrderShippingDetail,
  BaseOrderShippingMethod,
  BaseOrderShippingMethodAdjustment,
  BaseOrderShippingMethodTaxLine,
} from "../common"

export interface StoreOrder
  extends Omit<BaseOrder, "items" | "version" | "transations"> {
  /**
   * The order's shipping address.
   */
  shipping_address?: StoreOrderAddress | null
  /**
   * The order's billing address.
   */
  billing_address?: StoreOrderAddress | null
  /**
   * The order's items.
   */
  items: StoreOrderLineItem[] | null
  /**
   * The order's shipping methods.
   */
  shipping_methods: StoreOrderShippingMethod[] | null
  /**
   * The order's payment collections.
   */
  payment_collections?: StorePaymentCollection[]
  /**
   * The order's fulfillments.
   */
  fulfillments?: StoreOrderFulfillment[]
  /**
   * The customer that placed the order.
   */
  customer?: StoreCustomer
}
export interface StoreOrderLineItem
  extends Omit<BaseOrderLineItem, "product" | "variant"> {
  /**
   * The associated product variant.
   */
  variant?: StoreProductVariant
  /**
   * The associated product.
   */
  product?: StoreProduct
  /**
   * The item's tax lines.
   */
  tax_lines?: (BaseOrderLineItemTaxLine & {
    item: StoreOrderLineItem
  })[]
  /**
   * The item's adjustments.
   */
  adjustments?: (BaseOrderLineItemAdjustment & {
    item: StoreOrderLineItem
  })[]
  /**
   * The item's action details.
   */
  detail: BaseOrderItemDetail & {
    item: StoreOrderLineItem
  }
}
export interface StoreOrderAddress extends BaseOrderAddress {
  /**
   * The address's country.
   */
  country?: StoreRegionCountry
}
export interface StoreOrderShippingMethod extends BaseOrderShippingMethod {
  tax_lines?: (BaseOrderShippingMethodTaxLine & {
    shipping_method: StoreOrderShippingMethod
  })[]
  adjustments?: (BaseOrderShippingMethodAdjustment & {
    shipping_method: StoreOrderShippingMethod
  })[]
  detail?: BaseOrderShippingDetail & {
    shipping_method: StoreOrderShippingMethod
  }
}
export interface StoreOrderFulfillment extends BaseOrderFulfillment {}
