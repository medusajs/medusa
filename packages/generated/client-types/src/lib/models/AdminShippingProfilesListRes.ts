/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingProfile } from "./ShippingProfile"

export interface AdminShippingProfilesListRes {
  shipping_profiles: Array<ShippingProfile>
}
