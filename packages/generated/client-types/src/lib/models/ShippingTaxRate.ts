/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingOption } from "./ShippingOption"
import type { TaxRate } from "./TaxRate"

/**
 * This represents the tax rates applied on a shipping option.
 */
export interface ShippingTaxRate {
  /**
   * The ID of the shipping option.
   */
  shipping_option_id: string
  /**
   * The details of the shipping option.
   */
  shipping_option?: ShippingOption | null
  /**
   * The ID of the associated tax rate.
   */
  rate_id: string
  /**
   * The details of the associated tax rate.
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
