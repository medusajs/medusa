/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { DiscountCondition } from "./DiscountCondition"
import type { ProductCollection } from "./ProductCollection"

/**
 * This represents the association between a discount condition and a product collection
 */
export interface DiscountConditionProductCollection {
  /**
   * The ID of the Product Collection
   */
  product_collection_id: string
  /**
   * The ID of the Discount Condition
   */
  condition_id: string
  /**
   * The details of the product collection.
   */
  product_collection?: ProductCollection | null
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
