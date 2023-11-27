/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { DiscountCondition } from "./DiscountCondition"
import type { Product } from "./Product"

/**
 * This represents the association between a discount condition and a product
 */
export interface DiscountConditionProduct {
  /**
   * The ID of the Product Tag
   */
  product_id: string
  /**
   * The ID of the Discount Condition
   */
  condition_id: string
  /**
   * The details of the product.
   */
  product?: Product | null
  /**
   * The details of the discount condition.
   */
  discount_condition?: DiscountCondition | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
