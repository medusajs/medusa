/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingOption } from "./ShippingOption"

export interface StoreShippingOptionsListRes {
  shipping_options: Array<ShippingOption>
}
