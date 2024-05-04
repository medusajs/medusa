/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Customer } from "./Customer"

/**
 * The list of customers with pagination fields.
 */
export interface AdminCustomersListRes {
  /**
   * An array of customer details.
   */
  customers: Array<Customer>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of customers skipped when retrieving the customers.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
