/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Swap } from './Swap';

export type AdminSwapsListRes = {
  swaps?: Array<Swap>;
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

