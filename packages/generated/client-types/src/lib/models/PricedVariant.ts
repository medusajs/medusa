/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductVariant } from "./ProductVariant"

export type PricedVariant = ProductVariant & {
  /**
   * The original price of the variant without any discounted prices applied.
   */
  original_price?: number
  /**
   * The calculated price of the variant. Can be a discounted price.
   */
  calculated_price?: number
  /**
   * The original price of the variant including taxes.
   */
  original_price_incl_tax?: number
  /**
   * The calculated price of the variant including taxes.
   */
  calculated_price_incl_tax?: number
  /**
   * The taxes applied on the original price.
   */
  original_tax?: number
  /**
   * The taxes applied on the calculated price.
   */
  calculated_tax?: number
  /**
   * An array of applied tax rates
   */
  tax_rates?: Array<{
    /**
     * The tax rate value
     */
    rate?: number
    /**
     * The name of the tax rate
     */
    name?: string
    /**
     * The code of the tax rate
     */
    code?: string
  }>
}
