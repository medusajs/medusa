/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"

/**
 * A product category can be used to categorize products into a hierarchy of categories.
 */
export interface ProductCategory {
  /**
   * The product category's ID
   */
  id: string
  /**
   * The product category's name
   */
  name: string
  /**
   * The product category's description.
   */
  description?: string
  /**
   * A unique string that identifies the Product Category - can for example be used in slug structures.
   */
  handle: string
  /**
   * A string for Materialized Paths - used for finding ancestors and descendents
   */
  mpath: string | null
  /**
   * A flag to make product category an internal category for admins
   */
  is_internal: boolean
  /**
   * A flag to make product category visible/hidden in the store front
   */
  is_active: boolean
  /**
   * An integer that depicts the rank of category in a tree node
   */
  rank?: number
  /**
   * The details of the category's children.
   */
  category_children: Array<ProductCategory>
  /**
   * The ID of the parent category.
   */
  parent_category_id: string | null
  /**
   * The details of the parent of this category.
   */
  parent_category?: ProductCategory | null
  /**
   * The details of the products that belong to this category.
   */
  products?: Array<Product>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
