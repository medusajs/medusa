/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetDraftOrdersParams = {
  /**
   * The number of items to skip before the results.
   */
  offset?: number;
  /**
   * Limit the number of items returned.
   */
  limit?: number;
  /**
   * a search term to search emails in carts associated with draft orders and display IDs of draft orders
   */
  'q'?: string;
};

