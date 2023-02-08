/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Product } from './Product';

/**
 * Represents a product category
 */
export type ProductCategory = {
  /**
   * The product category's ID
   */
  id: string;
  /**
   * The product category's name
   */
  name: string;
  /**
   * A unique string that identifies the Product Category - can for example be used in slug structures.
   */
  handle: string;
  /**
   * A string for Materialized Paths - used for finding ancestors and descendents
   */
  mpath: string | null;
  /**
   * A flag to make product category an internal category for admins
   */
  is_internal: boolean;
  /**
   * A flag to make product category visible/hidden in the store front
   */
  is_active: boolean;
  /**
   * Available if the relation `category_children` are expanded.
   */
  category_children: Array<ProductCategory>;
  /**
   * The ID of the parent category.
   */
  parent_category_id: string | null;
  /**
   * A product category object. Available if the relation `parent_category` is expanded.
   */
  parent_category?: ProductCategory | null;
  /**
   * Products associated with the category. Available if the relation `products` is expanded.
   */
  products?: Array<Product>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null;
};

