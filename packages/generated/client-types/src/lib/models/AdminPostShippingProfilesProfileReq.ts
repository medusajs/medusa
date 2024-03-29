/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The detail to update of the shipping profile.
 */
export interface AdminPostShippingProfilesProfileReq {
  /**
   * The name of the Shipping Profile
   */
  name?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
  /**
   * The type of the Shipping Profile
   */
  type?: "default" | "gift_card" | "custom"
  /**
   * product IDs to associate with the Shipping Profile
   */
  products?: any[]
  /**
   * Shipping option IDs to associate with the Shipping Profile
   */
  shipping_options?: any[]
}
