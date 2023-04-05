/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductCategoriesParams {
  /**
   * Query used for searching product category names or handles.
   */
  q?: string
  /**
   * Returns categories scoped by parent
   */
  parent_category_id?: string
  /**
   * Include all nested descendants of category
   */
  include_descendants_tree?: boolean
  /**
   * How many product categories to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of product categories returned.
   */
  limit?: number
}
