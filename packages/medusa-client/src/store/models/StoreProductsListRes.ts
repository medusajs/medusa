/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PricedProduct } from './PricedProduct';

export type StoreProductsListRes = {
  products?: Array<PricedProduct>;
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

