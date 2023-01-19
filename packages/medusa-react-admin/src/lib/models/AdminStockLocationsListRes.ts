/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StockLocationDTO } from './StockLocationDTO';

export type AdminStockLocationsListRes = {
  stock_locations?: Array<StockLocationDTO>;
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

