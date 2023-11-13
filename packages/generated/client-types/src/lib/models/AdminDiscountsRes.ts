/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Discount } from "./Discount"
import type { DiscountRule } from "./DiscountRule"
import type { Region } from "./Region"

/**
 * The discount's details.
 */
export interface AdminDiscountsRes {
  /**
   * Discount details.
   */
  discount: Merge<
    SetRelation<Discount, "parent_discount" | "regions" | "rule">,
    {
      regions: Array<
        SetRelation<Region, "fulfillment_providers" | "payment_providers">
      >
      rule: SetRelation<DiscountRule, "conditions">
    }
  >
}
