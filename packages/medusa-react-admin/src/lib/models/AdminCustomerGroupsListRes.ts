/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomerGroup } from './CustomerGroup';

export type AdminCustomerGroupsListRes = {
  customer_groups?: Array<CustomerGroup>;
  /**
   * The total number of items available
   */
  count?: number;
  /**
   * The number of items skipped before these items
   */
  offset?: number;
  /**
   * The number of items per page
   */
  limit?: number;
};

