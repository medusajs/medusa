/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { TaxRate } from "./TaxRate"

/**
 * The tax rate's details.
 */
export interface AdminTaxRatesRes {
  /**
   * Tax rate details.
   */
  tax_rate: TaxRate
}
