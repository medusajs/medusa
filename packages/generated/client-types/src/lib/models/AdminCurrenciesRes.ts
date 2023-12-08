/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Currency } from "./Currency"

/**
 * A currency's details.
 */
export interface AdminCurrenciesRes {
  /**
   * Currency details.
   */
  currency: Currency
}
