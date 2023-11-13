/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"
import type { ShippingOption } from "./ShippingOption"

/**
 * The shipping option's details.
 */
export interface AdminShippingOptionsRes {
  /**
   * Shipping option details.
   */
  shipping_option: Merge<
    SetRelation<ShippingOption, "profile" | "region" | "requirements">,
    {
      region: SetRelation<Region, "fulfillment_providers" | "payment_providers">
    }
  >
}
