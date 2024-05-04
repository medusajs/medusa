/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingProfile } from "./ShippingProfile"

/**
 * The shipping profile's details.
 */
export interface AdminShippingProfilesRes {
  /**
   * Shipping profile details.
   */
  shipping_profile: SetRelation<
    ShippingProfile,
    "products" | "shipping_options"
  >
}
