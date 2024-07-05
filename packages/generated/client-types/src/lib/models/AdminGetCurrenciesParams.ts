/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetCurrenciesParams {
  /**
   * filter by currency code.
   */
  code?: string
  /**
   * filter currencies by whether they include taxes or not.
   */
  includes_tax?: boolean
  /**
   * A field to sort order the retrieved currencies by.
   */
  order?: string
  /**
   * Term used to search currencies' name and code.
   */
  q?: string
  /**
   * The number of currencies to skip when retrieving the currencies.
   */
  offset?: number
  /**
   * The number of currencies to return.
   */
  limit?: number
}
