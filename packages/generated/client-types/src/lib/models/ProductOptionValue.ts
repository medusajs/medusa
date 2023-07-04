/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductOption } from "./ProductOption"
import type { ProductVariant } from "./ProductVariant"

/**
 * A value given to a Product Variant's option set. Product Variant have a Product Option Value for each of the Product Options defined on the Product.
 */
export interface ProductOptionValue {
  /**
   * The product option value's ID
   */
  id: string
  /**
   * The value that the Product Variant has defined for the specific Product Option (e.g. if the Product Option is \"Size\" this value could be `Small`, `Medium` or `Large`).
   */
  value: string
  /**
   * The ID of the Product Option that the Product Option Value is defined for.
   */
  option_id: string
  /**
   * Available if the relation `option` is expanded.
   */
  option?: ProductOption | null
  /**
   * The ID of the Product Variant that the Product Option Value is defined for.
   */
  variant_id: string
  /**
   * Available if the relation `variant` is expanded.
   */
  variant?: ProductVariant | null
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
