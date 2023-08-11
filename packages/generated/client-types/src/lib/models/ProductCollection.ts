/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"

/**
 * A Product Collection allows grouping together products for promotional purposes. For example, an admin can create a Summer collection, add products to it, and showcase it on the storefront.
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
   * The details of the products that belong to this product collection.
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
