import { StorePaymentCollection } from "../../payment"
import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderFulfillment,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "../common"

export interface StoreOrder extends BaseOrder {
  shipping_address?: StoreOrderAddress | null
  billing_address?: StoreOrderAddress | null
  items: StoreOrderLineItem[] | null
  shipping_methods: StoreOrderShippingMethod[] | null
  payment_collections?: StorePaymentCollection[]
  fulfillments?: StoreOrderFulfillment[]
}
export interface StoreOrderLineItem extends BaseOrderLineItem {}
export interface StoreOrderAddress extends BaseOrderAddress {}
export interface StoreOrderShippingMethod extends BaseOrderShippingMethod {}
export interface StoreOrderFulfillment extends BaseOrderFulfillment {}