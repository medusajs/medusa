/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"
import type { ShippingOption } from "./ShippingOption"

export interface AdminShippingOptionsRes {
  shipping_option: Merge<
    SetRelation<ShippingOption, "profile" | "region" | "requirements">,
    {
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
    }
  >
}
