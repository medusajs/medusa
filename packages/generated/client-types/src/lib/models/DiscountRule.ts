/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { DiscountCondition } from "./DiscountCondition"

/**
 * Holds the rules that governs how a Discount is calculated when applied to a Cart.
 */
export interface DiscountRule {
  /**
   * The discount rule's ID
   */
  id: string
  /**
   * The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers.
   */
  type: "fixed" | "percentage" | "free_shipping"
  /**
   * A short description of the discount
   */
  description: string | null
  /**
   * The value that the discount represents; this will depend on the type of the discount
   */
  value: number
  /**
   * The scope that the discount should apply to.
   */
  allocation: "total" | "item" | null
  /**
   * A set of conditions that can be used to limit when  the discount can be used. Available if the relation `conditions` is expanded.
   */
  conditions?: Array<DiscountCondition>
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
