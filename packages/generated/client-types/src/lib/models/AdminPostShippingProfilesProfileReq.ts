/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

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
   * An optional array of product ids to associate with the Shipping Profile
   */
  products?: any[]
  /**
   * An optional array of shipping option ids to associate with the Shipping Profile
   */
  shipping_options?: any[]
}
