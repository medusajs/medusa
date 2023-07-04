/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostCustomerGroupsReq {
  /**
   * Name of the customer group
   */
  name: string
  /**
   * Metadata for the customer.
   */
  metadata?: Record<string, any>
}
