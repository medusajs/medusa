/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Discount } from "./Discount"

export interface AdminDiscountConditionsDeleteRes {
  /**
   * The ID of the deleted DiscountCondition
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether the discount condition was deleted successfully or not.
   */
  deleted: boolean
  /**
   * The Discount to which the condition used to belong
   */
  discount: Discount
}
