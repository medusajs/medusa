import { StorePaymentCollection } from "../../payment"
import { StoreProduct, StoreProductVariant } from "../../product"
import { StoreRegion } from "../../region"
import {
  BaseCart,
  BaseCartAddress,
  BaseCartLineItem,
  BaseCartShippingMethod,
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
}
export interface StoreCartAddress extends BaseCartAddress {}
export interface StoreCartShippingMethod extends BaseCartShippingMethod {}