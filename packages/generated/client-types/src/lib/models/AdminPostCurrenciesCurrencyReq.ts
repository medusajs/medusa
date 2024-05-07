/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details to update in the currency
 */
export interface AdminPostCurrenciesCurrencyReq {
  /**
   * Tax included in prices of currency.
   */
  includes_tax?: boolean
}
