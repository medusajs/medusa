/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { CustomerGroup } from "./CustomerGroup"
import type { MoneyAmount } from "./MoneyAmount"

/**
 * Price Lists represents a set of prices that overrides the default price for one or more product variants.
 */
export interface PriceList {
  /**
   * The price list's ID
   */
  id: string
  /**
   * The price list's name
   */
  name: string
  /**
   * The price list's description
   */
  description: string
  /**
   * The type of Price List. This can be one of either `sale` or `override`.
   */
  type: "sale" | "override"
  /**
   * The status of the Price List
   */
  status: "active" | "draft"
  /**
   * The date with timezone that the Price List starts being valid.
   */
  starts_at: string | null
  /**
   * The date with timezone that the Price List stops being valid.
   */
  ends_at: string | null
  /**
   * The Customer Groups that the Price List applies to. Available if the relation `customer_groups` is expanded.
   */
  customer_groups?: Array<CustomerGroup>
  /**
   * The Money Amounts that are associated with the Price List. Available if the relation `prices` is expanded.
   */
  prices?: Array<MoneyAmount>
  /**
   * [EXPERIMENTAL] Does the price list prices include tax
   */
  includes_tax?: boolean
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
}
