/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PriceList } from './PriceList';

export type AdminPriceListsListRes = {
  price_lists?: Array<PriceList>;
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

