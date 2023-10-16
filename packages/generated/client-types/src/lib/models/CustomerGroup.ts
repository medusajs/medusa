/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Customer } from "./Customer"
import type { PriceList } from "./PriceList"

/**
 * A customer group that can be used to organize customers into groups of similar traits.
 */
export interface CustomerGroup {
  /**
   * The customer group's ID
   */
  id: string
  /**
   * The name of the customer group
   */
  name: string
  /**
   * The details of the customers that belong to the customer group.
   */
  customers?: Array<Customer>
  /**
   * The price lists that are associated with the customer group.
   */
  price_lists?: Array<PriceList>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
