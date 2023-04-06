/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductCategoriesParams {
  /**
   * Query used for searching product category names orhandles.
   */
  q?: string
  /**
   * Search for only internal categories.
   */
  is_internal?: boolean
  /**
   * Search for only active categories
   */
  is_active?: boolean
  /**
   * Include all nested descendants of category
   */
  include_descendants_tree?: boolean
  /**
   * Returns categories scoped by parent
   */
  parent_category_id?: string
  /**
   * How many product categories to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of product categories returned.
   */
  limit?: number
  /**
   * (Comma separated) Which fields should be expanded in the product category.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be included in the product category.
   */
  fields?: string
}
