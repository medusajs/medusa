/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostProductCategoriesCategoryReq {
  /**
   * The name to identify the Product Category by.
   */
  name?: string
  /**
   * A handle to be used in slugs.
   */
  handle?: string
  /**
   * A flag to make product category an internal category for admins
   */
  is_internal?: boolean
  /**
   * A flag to make product category visible/hidden in the store front
   */
  is_active?: boolean
  /**
   * The ID of the parent product category
   */
  parent_category_id?: string
  /**
   * The rank of the category in the tree node (starting from 0)
   */
  rank?: number
}
