/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductCategoriesParams {
  /**
   * term used to search product category's names and handles.
   */
  q?: string
  /**
   * Filter by handle.
   */
  handle?: string
  /**
   * Filter by the ID of a parent category. Only children of the provided parent category are retrieved.
   */
  parent_category_id?: string
  /**
   * Whether all nested categories inside a category should be retrieved.
   */
  include_descendants_tree?: boolean
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
