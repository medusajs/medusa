/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Return } from './Return';

export type AdminReturnsListRes = {
  returns?: Array<Return>;
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

