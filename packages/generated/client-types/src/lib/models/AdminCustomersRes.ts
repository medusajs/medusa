/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Customer } from "./Customer"

export interface AdminCustomersRes {
  /**
   * Customer details.
   */
  customer: SetRelation<Customer, "orders" | "shipping_addresses">
}
