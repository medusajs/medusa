/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StoreGetProductCategoriesParams = {
  /**
   * Query used for searching product category names orhandles.
   */
  'q'?: string;
  /**
   * Returns categories scoped by parent
   */
  parentCategoryId?: string;
  /**
   * How many product categories to skip in the result.
   */
  offset?: number;
  /**
   * Limit the number of product categories returned.
   */
  limit?: number;
};

