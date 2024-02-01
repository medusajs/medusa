/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { ProductOptionValue } from "./ProductOptionValue"

/**
 * A Product Option defines properties that may vary between different variants of a Product. Common Product Options are "Size" and "Color". Admins are free to create any product options.
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
   * The details of the values of the product option.
   */
  values?: Array<ProductOptionValue>
  /**
   * The ID of the product that this product option belongs to.
   */
  product_id: string
  /**
   * The details of the product that this product option belongs to.
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
