/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingMethod } from "./ShippingMethod"

/**
 * A Shipping Method Tax Line represents the taxes applied on a shipping method in a cart.
 */
export interface ShippingMethodTaxLine {
  /**
   * The line item tax line's ID
   */
  id: string
  /**
   * A code to identify the tax type by
   */
  code: string | null
  /**
   * A human friendly name for the tax
   */
  name: string
  /**
   * The numeric rate to charge tax by
   */
  rate: number
  /**
   * The ID of the line item
   */
  shipping_method_id: string
  /**
   * The details of the associated shipping method.
   */
  shipping_method?: ShippingMethod | null
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
