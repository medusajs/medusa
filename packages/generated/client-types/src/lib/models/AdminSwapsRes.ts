/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { Fulfillment } from "./Fulfillment"
import type { LineItem } from "./LineItem"
import type { ShippingMethod } from "./ShippingMethod"
import type { Swap } from "./Swap"

export interface AdminSwapsRes {
  swap: Merge<
    SetRelation<
      Swap,
      | "additional_items"
      | "cart"
      | "fulfillments"
      | "order"
      | "payment"
      | "return_order"
      | "shipping_address"
      | "shipping_methods"
    >,
    {
      additional_items: Array<SetRelation<LineItem, "adjustments">>
      cart: Merge<
        SetRelation<Cart, "items">,
        {
          items: Array<SetRelation<LineItem, "adjustments" | "variant">>
        }
      >
      fulfillments: Array<SetRelation<Fulfillment, "items">>
      shipping_methods: Array<SetRelation<ShippingMethod, "shipping_option">>
    }
  >
}
