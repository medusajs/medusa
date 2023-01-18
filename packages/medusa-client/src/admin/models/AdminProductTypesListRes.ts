/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProductType } from './ProductType';

export type AdminProductTypesListRes = {
  product_types?: Array<ProductType>;
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

