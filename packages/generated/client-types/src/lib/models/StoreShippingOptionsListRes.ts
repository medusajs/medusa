/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedShippingOption } from "./PricedShippingOption"

export interface StoreShippingOptionsListRes {
  shipping_options: Array<SetRelation<PricedShippingOption, "requirements">>
}
