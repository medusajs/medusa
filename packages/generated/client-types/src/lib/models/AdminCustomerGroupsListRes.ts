/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { CustomerGroup } from "./CustomerGroup"

export interface AdminCustomerGroupsListRes {
  /**
   * An array of customer group details.
   */
  customer_groups: Array<CustomerGroup>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of customer groups skipped when retrieving the customer groups.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
