/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Discount } from "./Discount"
import type { DiscountRule } from "./DiscountRule"

/**
 * The list of discounts with pagination fields.
 */
export interface AdminDiscountsListRes {
  /**
   * The list of discounts.
   */
  discounts: Array<
    Merge<
      SetRelation<Discount, "parent_discount" | "regions" | "rule">,
      {
        rule: SetRelation<DiscountRule, "conditions">
      }
    >
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of discounts skipped when retrieving the discounts.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
