import { StoreProduct } from "../../product"
import {
  BaseCart,
  BaseCartAddress,
  BaseCartLineItem,
  BaseCartShippingMethod,
} from "../common"

export interface StoreCart extends BaseCart {
  billing_address?: StoreCartAddress
  shipping_address?: StoreCartAddress
  items?: StoreCartLineItem[]
}
export interface StoreCartLineItem extends BaseCartLineItem {
  product?: StoreProduct
  cart: StoreCart
}
export interface StoreCartAddress extends BaseCartAddress {}
export interface StoreCartShippingMethod extends BaseCartShippingMethod {}