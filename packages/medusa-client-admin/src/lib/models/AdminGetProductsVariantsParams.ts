/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetProductsVariantsParams = {
  /**
   * Comma separated string of the column to select.
   */
  fields?: string;
  /**
   * Comma separated string of the relations to include.
   */
  expand?: string;
  /**
   * How many items to skip before the results.
   */
  offset?: number;
  /**
   * Limit the number of items returned.
   */
  limit?: number;
};

