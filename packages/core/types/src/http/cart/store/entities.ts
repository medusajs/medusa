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
  /**
   * The cart's shipping address.
   */
  shipping_address?: StoreCartAddress
  /**
   * The cart's billing address.
   */
  billing_address?: StoreCartAddress
  /**
   * The cart's items.
   */
  items?: StoreCartLineItem[]
  /**
   * The cart's shipping methods.
   */
  shipping_methods?: StoreCartShippingMethod[]
  /**
   * The cart's payment collection.
   */
  payment_collection?: StorePaymentCollection
  /**
   * The cart's region
   */
  region?: StoreRegion
}
export interface StoreCartLineItem
  extends Omit<BaseCartLineItem, "product" | "variant" | "cart"> {
  /**
   * The product this item is created for.
   */
  product?: StoreProduct
  /**
   * The variant added to the cart.
   */
  variant?: StoreProductVariant
  /**
   * The cart this item belongs to.
   */
  cart: StoreCart
  /**
   * The item's tax lines.
   */
  tax_lines?: (BaseLineItemTaxLine & {
    item: StoreCartLineItem
  })[]
  /**
   * The item's adjustments.
   */
  adjustments?: (BaseLineItemAdjustment & {
    item: StoreCartLineItem
  })[]
}
export interface StoreCartAddress extends BaseCartAddress {}
export interface StoreCartShippingMethod extends BaseCartShippingMethod {
  /**
   * The shipping method's tax lines.
   */
  tax_lines?: (BaseShippingMethodTaxLine & {
    shipping_method: StoreCartShippingMethod
  })[]
  /**
   * The shipping method's adjustments.
   */
  adjustments?: (BaseShippingMethodAdjustment & {
    shipping_method: StoreCartShippingMethod
  })[]
}
