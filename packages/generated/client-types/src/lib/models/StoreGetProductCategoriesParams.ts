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
   * Query used for searching product category by handle.
   */
  handle?: string
  /**
   * Returns categories scoped by parent
   */
  parent_category_id?: string
  /**
   * Include all nested descendants of category
   */
  include_descendants_tree?: boolean
  /**
   * Descendants categories at retreived upto a certain depth. descendants_depth is a number greater than 0.
   */
  descendants_depth?: number
  /**
   * Query categories at a certain depth. depth is an array of number greater than 0.
   */
  depth?: Array<number>
  /**
   * How many product categories to skip in the result.
   */
  offset?: number
  /**
   * Limit the number of product categories returned.
   */
  limit?: number
}
