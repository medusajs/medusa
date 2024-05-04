/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { DiscountCondition } from "./DiscountCondition"

export interface AdminDiscountConditionsRes {
  /**
   * Discount condition details.
   */
  discount_condition: SetRelation<DiscountCondition, "discount_rule">
}
