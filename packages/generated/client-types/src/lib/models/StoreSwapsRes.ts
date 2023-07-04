/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Fulfillment } from "./Fulfillment"
import type { LineItem } from "./LineItem"
import type { Return } from "./Return"
import type { Swap } from "./Swap"

export interface StoreSwapsRes {
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
      additional_items: Array<SetRelation<LineItem, "variant">>
      fulfillments: Array<SetRelation<Fulfillment, "items">>
      return_order: SetRelation<Return, "shipping_method">
    }
  >
}
