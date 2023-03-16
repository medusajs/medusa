/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { ProductOptionValue } from "./ProductOptionValue"

/**
 * Product Options define properties that may vary between different variants of a Product. Common Product Options are "Size" and "Color", but Medusa doesn't limit what Product Options that can be defined.
 */
export interface ProductOption {
  /**
   * The product option's ID
   */
  id: string
  /**
   * The title that the Product Option is defined by (e.g. `Size`).
   */
  title: string
  /**
   * The Product Option Values that are defined for the Product Option. Available if the relation `values` is expanded.
   */
  values?: Array<ProductOptionValue>
  /**
   * The ID of the Product that the Product Option is defined for.
   */
  product_id: string
  /**
   * A product object. Available if the relation `product` is expanded.
   */
  product?: Product | null
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
