/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"
import type { ShippingOption } from "./ShippingOption"

export interface AdminShippingOptionsListRes {
  shipping_options: Array<
    Merge<
      SetRelation<ShippingOption, "profile" | "region" | "requirements">,
      {
        region: SetRelation<
          Region,
          "fulfillment_providers" | "payment_providers"
        >
      }
    >
  >
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of items skipped before these items
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
