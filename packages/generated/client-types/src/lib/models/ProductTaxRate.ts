/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { TaxRate } from "./TaxRate"

/**
 * This represents the association between a tax rate and a product to indicate that the product is taxed in a way different than the default.
 */
export interface ProductTaxRate {
  /**
   * The ID of the Product
   */
  product_id: string
  /**
   * The details of the product.
   */
  product?: Product | null
  /**
   * The ID of the Tax Rate
   */
  rate_id: string
  /**
   * The details of the tax rate.
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
