/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { ProductType } from "./ProductType"
import type { Region } from "./Region"
import type { ShippingOption } from "./ShippingOption"

/**
 * A Tax Rate can be used to associate a certain rate to charge on products within a given Region
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
   * The id of the Region that the rate belongs to
   */
  region_id: string
  /**
   * A region object. Available if the relation `region` is expanded.
   */
  region?: Region | null
  /**
   * The products that belong to this tax rate. Available if the relation `products` is expanded.
   */
  products?: Array<Product>
  /**
   * The product types that belong to this tax rate. Available if the relation `product_types` is expanded.
   */
  product_types?: Array<ProductType>
  /**
   * The shipping options that belong to this tax rate. Available if the relation `shipping_options` is expanded.
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
