/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents a product category
 */
export type ProductCategory = {
  /**
   * The product category's ID
   */
  id?: string;
  /**
   * The product category's name
   */
  name: string;
  /**
   * A unique string that identifies the Category - example: slug structures.
   */
  handle?: string;
  /**
   * A string for Materialized Paths - used for finding ancestors and descendents
   */
  mpath?: string;
  /**
   * A flag to make product category an internal category for admins
   */
  is_internal?: boolean;
  /**
   * A flag to make product category visible/hidden in the store front
   */
  is_active?: boolean;
  /**
   * Available if the relation `category_children` are expanded.
   */
  category_children?: Array<Record<string, any>>;
  /**
   * The ID of the parent category.
   */
  parent_category_id?: string;
  /**
   * A product category object. Available if the relation `parent_category` is expanded.
   */
  parent_category?: Record<string, any>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
};

