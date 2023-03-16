/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedVariant } from "./PricedVariant"

export interface StoreVariantsListRes {
  variants: Array<SetRelation<PricedVariant, "prices" | "options" | "product">>
}
