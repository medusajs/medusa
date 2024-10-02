import { StorePaymentCollection } from "../../payment"
import { StoreProduct, StoreProductVariant } from "../../product"
import { StoreRegion } from "../../region"
import {
  BaseCart,
  BaseCartAddress,
  BaseCartLineItem,
  BaseCartShippingMethod,
  BaseLineItemAdjustment,
  BaseLineItemTaxLine,
  BaseShippingMethodAdjustment,
  BaseShippingMethodTaxLine,
} from "../common"

export interface StoreCart extends Omit<BaseCart, "items"> {
  shipping_address?: StoreCartAddress
  billing_address?: StoreCartAddress
  items?: StoreCartLineItem[]
  shipping_methods?: StoreCartShippingMethod[]
  payment_collection?: StorePaymentCollection
  region?: StoreRegion
}
export interface StoreCartLineItem extends Omit<BaseCartLineItem, "product" | "variant" | "cart"> {
  product?: StoreProduct
  variant?: StoreProductVariant
  cart: StoreCart
  tax_lines?: (BaseLineItemTaxLine & {
    item: StoreCartLineItem
  })[]
  adjustments?: (BaseLineItemAdjustment & {
    item: StoreCartLineItem
  })[]
}
export interface StoreCartAddress extends BaseCartAddress {}
export interface StoreCartShippingMethod extends BaseCartShippingMethod {
  tax_lines?: (BaseShippingMethodTaxLine & {
    shipping_method: StoreCartShippingMethod
  })[]
  adjustments?: (BaseShippingMethodAdjustment & {
    shipping_method: StoreCartShippingMethod
  })[]
}