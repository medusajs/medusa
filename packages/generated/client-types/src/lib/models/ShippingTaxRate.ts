/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingOption } from "./ShippingOption"
import type { TaxRate } from "./TaxRate"

/**
 * Associates a tax rate with a shipping option to indicate that the shipping option is taxed in a certain way
 */
export interface ShippingTaxRate {
  /**
   * The ID of the Shipping Option
   */
  shipping_option_id: string
  /**
   * Available if the relation `shipping_option` is expanded.
   */
  shipping_option?: ShippingOption | null
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
