/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Region } from './Region';

export type AdminRegionsListRes = {
  regions?: Array<Region>;
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

