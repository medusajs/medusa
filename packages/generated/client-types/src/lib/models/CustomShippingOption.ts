/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"
import type { ShippingOption } from "./ShippingOption"

/**
 * Custom Shipping Options are 'overriden' Shipping Options. Store managers can attach a Custom Shipping Option to a cart in order to set a custom price for a particular Shipping Option
 */
export interface CustomShippingOption {
  /**
   * The custom shipping option's ID
   */
  id: string
  /**
   * The custom price set that will override the shipping option's original price
   */
  price: number
  /**
   * The ID of the Shipping Option that the custom shipping option overrides
   */
  shipping_option_id: string
  /**
   * A shipping option object. Available if the relation `shipping_option` is expanded.
   */
  shipping_option?: ShippingOption | null
  /**
   * The ID of the Cart that the custom shipping option is attached to
   */
  cart_id: string | null
  /**
   * A cart object. Available if the relation `cart` is expanded.
   */
  cart?: Cart | null
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
