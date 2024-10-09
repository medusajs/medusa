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
  shipping_address?: StoreOrderAddress | null
  billing_address?: StoreOrderAddress | null
  items: StoreOrderLineItem[] | null
  shipping_methods: StoreOrderShippingMethod[] | null
  payment_collections?: StorePaymentCollection[]
  fulfillments?: StoreOrderFulfillment[]
  customer?: StoreCustomer
}
export interface StoreOrderLineItem
  extends Omit<BaseOrderLineItem, "product" | "variant"> {
  variant?: StoreProductVariant
  product?: StoreProduct
  tax_lines?: (BaseOrderLineItemTaxLine & {
    item: StoreOrderLineItem
  })[]
  adjustments?: (BaseOrderLineItemAdjustment & {
    item: StoreOrderLineItem
  })[]
  detail: BaseOrderItemDetail & {
    item: StoreOrderLineItem
  }
}
export interface StoreOrderAddress extends BaseOrderAddress {
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
