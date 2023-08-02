/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { ProductType } from "./ProductType"
import type { Region } from "./Region"
import type { ShippingOption } from "./ShippingOption"

/**
 * A Tax Rate can be used to define a custom rate to charge on specified products, product types, and shipping options within a given region.
 */
export interface TaxRate {
  /**
   * The tax rate's ID
   */
  id: string
  /**
   * The numeric rate to charge
   */
  rate: number | null
  /**
   * A code to identify the tax type by
   */
  code: string | null
  /**
   * A human friendly name for the tax
   */
  name: string
  /**
   * The ID of the region that the rate belongs to.
   */
  region_id: string
  /**
   * The details of the region that the rate belongs to.
   */
  region?: Region | null
  /**
   * The details of the products that belong to this tax rate.
   */
  products?: Array<Product>
  /**
   * The details of the product types that belong to this tax rate.
   */
  product_types?: Array<ProductType>
  /**
   * The details of the shipping options that belong to this tax rate.
   */
  shipping_options?: Array<ShippingOption>
  /**
   * The count of products
   */
  product_count?: number
  /**
   * The count of product types
   */
  product_type_count?: number
  /**
   * The count of shipping options
   */
  shipping_option_count?: number
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
