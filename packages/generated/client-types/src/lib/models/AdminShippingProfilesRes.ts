/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingProfile } from "./ShippingProfile"

export interface AdminShippingProfilesRes {
  /**
   * Shipping profile details.
   */
  shipping_profile: SetRelation<
    ShippingProfile,
    "products" | "shipping_options"
  >
}
