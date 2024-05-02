/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductCategoriesParams {
  /**
   * term to search product categories' names and handles.
   */
  q?: string
  /**
   * Filter by handle.
   */
  handle?: string
  /**
   * Filter by whether the category is internal or not.
   */
  is_internal?: boolean
  /**
   * Filter by whether the category is active or not.
   */
  is_active?: boolean
  /**
   * If set to `true`, all nested descendants of a category are included in the response.
   */
  include_descendants_tree?: boolean
  /**
   * Filter by the ID of a parent category.
   */
  parent_category_id?: string
  /**
   * The number of product categories to skip when retrieving the product categories.
   */
  offset?: number
  /**
   * Limit the number of product categories returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in the returned product categories.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned product categories.
   */
  fields?: string
}
