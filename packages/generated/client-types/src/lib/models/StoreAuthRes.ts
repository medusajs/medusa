/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Customer } from "./Customer"
import type { Order } from "./Order"

/**
 * The customer's details.
 */
export interface StoreAuthRes {
  /**
   * Customer's details.
   */
  customer: Merge<
    SetRelation<Customer, "orders" | "shipping_addresses">,
    {
      orders: Array<SetRelation<Order, "items">>
    }
  >
}
