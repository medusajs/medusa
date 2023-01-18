/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetProductCategoriesParams = {
  /**
   * Query used for searching product category names orhandles.
   */
  'q'?: string;
  /**
   * Search for only internal categories.
   */
  isInternal?: boolean;
  /**
   * Search for only active categories
   */
  isActive?: boolean;
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
  /**
   * (Comma separated) Which fields should be expanded in the product category.
   */
  expand?: string;
  /**
   * (Comma separated) Which fields should be included in the product category.
   */
  fields?: string;
};

