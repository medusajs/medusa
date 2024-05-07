/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"
import type { ShippingOption } from "./ShippingOption"

/**
 * The list of shipping options with pagination fields.
 */
export interface AdminShippingOptionsListRes {
  /**
   * An array of shipping options details.
   */
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
   * The number of shipping options skipped when retrieving the shipping options.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
