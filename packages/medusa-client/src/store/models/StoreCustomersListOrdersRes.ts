/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Order } from './Order';

export type StoreCustomersListOrdersRes = {
  orders?: Array<Order>;
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

