import {
  BaseCart,
  BaseCartAddress,
  BaseCartLineItem,
  BaseCartShippingMethod,
} from "../common"

export interface StoreCart extends BaseCart {}
export interface StoreCartLineItem extends BaseCartLineItem {}
export interface StoreCartAddress extends BaseCartAddress {}
export interface StoreCartShippingMethod extends BaseCartShippingMethod {}