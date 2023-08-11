/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostTaxRatesTaxRateParams {
  /**
   * Comma-separated fields that should be included in the returned tax rate.
   */
  fields?: Array<string>
  /**
   * Comma-separated relations that should be expanded in the returned tax rate.
   */
  expand?: Array<string>
}
