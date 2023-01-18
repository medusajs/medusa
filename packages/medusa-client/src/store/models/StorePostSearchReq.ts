/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StorePostSearchReq = {
  /**
   * The query to run the search with.
   */
  'q': string;
  /**
   * How many products to skip in the result.
   */
  offset?: number;
  /**
   * Limit the number of products returned.
   */
  limit?: number;
};

