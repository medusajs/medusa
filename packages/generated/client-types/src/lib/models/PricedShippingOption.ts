/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingOption } from "./ShippingOption"

export type PricedShippingOption = ShippingOption & {
  /**
   * Price including taxes
   */
  price_incl_tax?: number
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
  /**
   * The taxes applied.
   */
  tax_amount?: number
}
