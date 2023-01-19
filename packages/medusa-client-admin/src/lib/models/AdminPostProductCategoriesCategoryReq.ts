/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostProductCategoriesCategoryReq = {
  /**
   * The name to identify the Product Category by.
   */
  name?: string;
  /**
   * A handle to be used in slugs.
   */
  handle?: string;
  /**
   * A flag to make product category an internal category for admins
   */
  is_internal?: boolean;
  /**
   * A flag to make product category visible/hidden in the store front
   */
  is_active?: boolean;
  /**
   * The ID of the parent product category
   */
  parent_category_id?: string;
};

