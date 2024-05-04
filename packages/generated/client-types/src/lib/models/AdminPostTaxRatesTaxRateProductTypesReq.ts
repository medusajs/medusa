/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The product types to add to the tax rate.
 */
export interface AdminPostTaxRatesTaxRateProductTypesReq {
  /**
   * The IDs of the types of products to associate with this tax rate
   */
  product_types: Array<string>
}
