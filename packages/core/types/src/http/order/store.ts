import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "./common"

export interface StoreOrder extends BaseOrder {}
export interface StoreOrderLineItem extends BaseOrderLineItem {}
export interface StoreOrderAddress extends BaseOrderAddress {}
export interface StoreOrderShippingMethod extends BaseOrderShippingMethod {}
