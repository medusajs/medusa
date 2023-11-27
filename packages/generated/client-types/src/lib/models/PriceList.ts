/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { CustomerGroup } from "./CustomerGroup"
import type { MoneyAmount } from "./MoneyAmount"

/**
 * A Price List represents a set of prices that override the default price for one or more product variants.
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
   * The details of the customer groups that the Price List can apply to.
   */
  customer_groups?: Array<CustomerGroup>
  /**
   * The prices that belong to the price list, represented as a Money Amount.
   */
  prices?: Array<MoneyAmount>
  /**
   * Whether the price list prices include tax
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
