/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { Order } from "./Order"
import type { Swap } from "./Swap"

/**
 * If the cart is completed successfully, this will have the created order or the swap's details, based on the cart's type. Otherwise, it'll be the cart's details.
 */
export interface StoreCompleteCartRes {
  /**
   * The type of the data property. If the cart completion fails, type will be `cart` and the data object will be the cart's details. If the cart completion is successful and the cart is used for checkout, type will be `order` and the data object will be the order's details. If the cart completion is successful and the cart is used for swap creation, type will be `swap` and the data object will be the swap's details.
   */
  type: "order" | "cart" | "swap"
  /**
   * The data of the result object. Its type depends on the type field.
   */
  data: Order | Cart | Swap
}
