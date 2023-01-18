/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BatchJob } from './BatchJob';

export type AdminBatchJobListRes = {
  batch_jobs?: Array<BatchJob>;
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

