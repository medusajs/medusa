/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductType } from "./ProductType"
import type { TaxRate } from "./TaxRate"

/**
 * Associates a tax rate with a product type to indicate that the product type is taxed in a certain way
 */
export interface ProductTypeTaxRate {
  /**
   * The ID of the Product type
   */
  product_type_id: string
  /**
   * Available if the relation `product_type` is expanded.
   */
  product_type?: ProductType | null
  /**
   * The id of the Tax Rate
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
