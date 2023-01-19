/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetCurrenciesParams = {
  /**
   * Code of the currency to search for.
   */
  code?: string;
  /**
   * Search for tax inclusive currencies.
   */
  includes_tax?: boolean;
  /**
   * order to retrieve products in.
   */
  order?: string;
  /**
   * How many products to skip in the result.
   */
  offset?: number;
  /**
   * Limit the number of products returned.
   */
  limit?: number;
};

