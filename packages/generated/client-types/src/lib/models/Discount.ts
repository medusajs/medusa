/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { DiscountRule } from "./DiscountRule"
import type { Region } from "./Region"

/**
 * A discount can be applied to a cart for promotional purposes.
 */
export interface Discount {
  /**
   * The discount's ID
   */
  id: string
  /**
   * A unique code for the discount - this will be used by the customer to apply the discount
   */
  code: string
  /**
   * A flag to indicate if multiple instances of the discount can be generated. I.e. for newsletter discounts
   */
  is_dynamic: boolean
  /**
   * The ID of the discount rule that defines how the discount will be applied to a cart.
   */
  rule_id: string | null
  /**
   * The details of the discount rule that defines how the discount will be applied to a cart..
   */
  rule?: DiscountRule | null
  /**
   * Whether the Discount has been disabled. Disabled discounts cannot be applied to carts
   */
  is_disabled: boolean
  /**
   * The Discount that the discount was created from. This will always be a dynamic discount
   */
  parent_discount_id: string | null
  /**
   * The details of the parent discount that this discount was created from.
   */
  parent_discount?: Discount | null
  /**
   * The time at which the discount can be used.
   */
  starts_at: string
  /**
   * The time at which the discount can no longer be used.
   */
  ends_at: string | null
  /**
   * Duration the discount runs between
   */
  valid_duration: string | null
  /**
   * The details of the regions in which the Discount can be used.
   */
  regions?: Array<Region>
  /**
   * The maximum number of times that a discount can be used.
   */
  usage_limit: number | null
  /**
   * The number of times a discount has been used.
   */
  usage_count: number
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
