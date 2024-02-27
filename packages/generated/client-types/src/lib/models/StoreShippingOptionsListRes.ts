/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedShippingOption } from "./PricedShippingOption"

/**
 * The list of shipping options.
 */
export interface StoreShippingOptionsListRes {
  /**
   * An array of shipping options details.
   */
  shipping_options: Array<SetRelation<PricedShippingOption, "requirements">>
}
