/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderEdit } from './OrderEdit';

export type AdminOrderEditsListRes = {
  order_edits?: Array<OrderEdit>;
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

