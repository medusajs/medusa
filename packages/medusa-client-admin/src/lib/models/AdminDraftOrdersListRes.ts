/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DraftOrder } from './DraftOrder';

export type AdminDraftOrdersListRes = {
  draft_orders?: Array<DraftOrder>;
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

