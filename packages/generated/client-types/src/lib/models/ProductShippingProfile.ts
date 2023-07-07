/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Association between a product and a shipping profile.
 */
export interface ProductShippingProfile {
  /**
   * The id of the Product Shipping Profile.
   */
  id: string
  /**
   * The id of the Shipping Profile.
   */
  profile_id: string
  /**
   * the id of the Product.
   */
  product_id: string
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
}
