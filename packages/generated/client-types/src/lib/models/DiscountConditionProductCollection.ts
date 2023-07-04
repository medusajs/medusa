/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { DiscountCondition } from "./DiscountCondition"
import type { ProductCollection } from "./ProductCollection"

/**
 * Associates a discount condition with a product collection
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
   * Available if the relation `product_collection` is expanded.
   */
  product_collection?: ProductCollection | null
  /**
   * Available if the relation `discount_condition` is expanded.
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
