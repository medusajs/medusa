/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { CustomerGroup } from "./CustomerGroup"
import type { DiscountCondition } from "./DiscountCondition"

/**
 * Associates a discount condition with a customer group
 */
export interface DiscountConditionCustomerGroup {
  /**
   * The ID of the Product Tag
   */
  customer_group_id: string
  /**
   * The ID of the Discount Condition
   */
  condition_id: string
  /**
   * Available if the relation `customer_group` is expanded.
   */
  customer_group?: CustomerGroup | null
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
