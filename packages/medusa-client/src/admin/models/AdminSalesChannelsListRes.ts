/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SalesChannel } from './SalesChannel';

export type AdminSalesChannelsListRes = {
  sales_channels?: Array<SalesChannel>;
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

