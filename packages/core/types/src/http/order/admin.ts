import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "./common"

export interface AdminOrder extends BaseOrder {}
export interface AdminOrderLineItem extends BaseOrderLineItem {}
export interface AdminOrderAddress extends BaseOrderAddress {}
export interface AdminOrderShippingMethod extends BaseOrderShippingMethod {}
