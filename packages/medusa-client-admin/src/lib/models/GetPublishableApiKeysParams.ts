/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type GetPublishableApiKeysParams = {
  /**
   * Query used for searching publishable api keys by title.
   */
  'q'?: string;
  /**
   * The number of items in the response
   */
  limit?: number;
  /**
   * The offset of items in response
   */
  offset?: number;
  /**
   * Comma separated list of relations to include in the results.
   */
  expand?: string;
  /**
   * Comma separated list of fields to include in the results.
   */
  fields?: string;
};

