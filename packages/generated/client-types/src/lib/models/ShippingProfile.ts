/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"
import type { ShippingOption } from "./ShippingOption"

/**
 * Shipping Profiles have a set of defined Shipping Options that can be used to fulfill a given set of Products.
 */
export interface ShippingProfile {
  /**
   * The shipping profile's ID
   */
  id: string
  /**
   * The name given to the Shipping profile - this may be displayed to the Customer.
   */
  name: string
  /**
   * The type of the Shipping Profile, may be `default`, `gift_card` or `custom`.
   */
  type: "default" | "gift_card" | "custom"
  /**
   * The Products that the Shipping Profile defines Shipping Options for. Available if the relation `products` is expanded.
   */
  products?: Array<Product>
  /**
   * The Shipping Options that can be used to fulfill the Products in the Shipping Profile. Available if the relation `shipping_options` is expanded.
   */
  shipping_options?: Array<ShippingOption>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
