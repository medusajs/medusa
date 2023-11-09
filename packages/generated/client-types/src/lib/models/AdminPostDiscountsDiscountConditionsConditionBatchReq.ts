/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDiscountsDiscountConditionsConditionBatchReq {
  /**
   * The resources to be added to the discount condition
   */
  resources: Array<{
    /**
     * The ID of the item
     */
    id: string
  }>
}
