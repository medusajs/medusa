/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductType } from "./ProductType"
import type { TaxRate } from "./TaxRate"

/**
 * This represents the association between a tax rate and a product type to indicate that the product type is taxed in a different way than the default.
 */
export interface ProductTypeTaxRate {
  /**
   * The ID of the Product type
   */
  product_type_id: string
  /**
   * The details of the product type.
   */
  product_type?: ProductType | null
  /**
   * The id of the Tax Rate
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
