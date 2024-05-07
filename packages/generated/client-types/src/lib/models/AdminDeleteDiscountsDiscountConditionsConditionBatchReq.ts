/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The resources to remove.
 */
export interface AdminDeleteDiscountsDiscountConditionsConditionBatchReq {
  /**
   * The resources to be removed from the discount condition
   */
  resources: Array<{
    /**
     * The id of the item
     */
    id: string
  }>
}
