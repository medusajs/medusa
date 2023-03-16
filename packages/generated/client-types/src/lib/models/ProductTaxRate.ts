/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { TaxRate } from "./TaxRate"

/**
 * Associates a tax rate with a product to indicate that the product is taxed in a certain way
 */
export interface ProductTaxRate {
  /**
   * The ID of the Product
   */
  product_id: string
  /**
   * Available if the relation `product` is expanded.
   */
  product?: Product | null
  /**
   * The ID of the Tax Rate
   */
  rate_id: string
  /**
   * Available if the relation `tax_rate` is expanded.
   */
  tax_rate?: TaxRate | null
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
