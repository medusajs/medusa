/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Discount } from "./Discount"
import type { DiscountRule } from "./DiscountRule"

export interface AdminDiscountsListRes {
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
   * The number of items skipped before these items
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
