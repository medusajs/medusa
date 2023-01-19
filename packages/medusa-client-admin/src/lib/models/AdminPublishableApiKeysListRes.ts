/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PublishableApiKey } from './PublishableApiKey';

export type AdminPublishableApiKeysListRes = {
  publishable_api_keys?: Array<PublishableApiKey>;
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

