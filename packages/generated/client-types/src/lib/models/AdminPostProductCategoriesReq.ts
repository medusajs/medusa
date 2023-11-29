/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostProductCategoriesReq {
  /**
   * The name of the product category
   */
  name: string
  /**
   * The description of the product category.
   */
  description?: string
  /**
   * The handle of the product category. If none is provided, the kebab-case version of the name will be used. This field can be used as a slug in URLs.
   */
  handle?: string
  /**
   * If set to `true`, the product category will only be available to admins.
   */
  is_internal?: boolean
  /**
   * If set to `false`, the product category will not be available in the storefront.
   */
  is_active?: boolean
  /**
   * The ID of the parent product category
   */
  parent_category_id?: string
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
