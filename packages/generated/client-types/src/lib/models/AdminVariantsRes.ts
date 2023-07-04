/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { PricedVariant } from "./PricedVariant"

export interface AdminVariantsRes {
  variant: SetRelation<PricedVariant, "options" | "prices" | "product">
}
