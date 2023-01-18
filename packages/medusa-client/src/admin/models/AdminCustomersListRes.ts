/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Customer } from './Customer';

export type AdminCustomersListRes = {
  customers?: Array<Customer>;
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

