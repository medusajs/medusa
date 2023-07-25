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
   * Metadata of the customer group.
   */
  metadata?: Record<string, any>
}
