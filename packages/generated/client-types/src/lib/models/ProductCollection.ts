/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"

/**
 * Product Collections represents a group of Products that are related.
 */
export interface ProductCollection {
  /**
   * The product collection's ID
   */
  id: string
  /**
   * The title that the Product Collection is identified by.
   */
  title: string
  /**
   * A unique string that identifies the Product Collection - can for example be used in slug structures.
   */
  handle: string | null
  /**
   * The Products contained in the Product Collection. Available if the relation `products` is expanded.
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
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
