/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Product Collections represents a group of Products that are related.
 */
export type ProductCollection = {
  /**
   * The product collection's ID
   */
  id?: string;
  /**
   * The title that the Product Collection is identified by.
   */
  title: string;
  /**
   * A unique string that identifies the Product Collection - can for example be used in slug structures.
   */
  handle?: string;
  /**
   * The Products contained in the Product Collection. Available if the relation `products` is expanded.
   */
  products?: Array<Record<string, any>>;
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
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

