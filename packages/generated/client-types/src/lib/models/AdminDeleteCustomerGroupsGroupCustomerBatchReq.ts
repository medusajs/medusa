/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The customers to remove from the customer group.
 */
export interface AdminDeleteCustomerGroupsGroupCustomerBatchReq {
  /**
   * The ids of the customers to remove
   */
  customer_ids: Array<{
    /**
     * ID of the customer
     */
    id: string
  }>
}
