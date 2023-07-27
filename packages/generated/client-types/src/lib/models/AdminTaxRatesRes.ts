/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { TaxRate } from "./TaxRate"

export interface AdminTaxRatesRes {
  /**
   * Tax rate details.
   */
  tax_rate: TaxRate
}
