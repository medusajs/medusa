/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeleteTaxRatesTaxRateProductTypesReq {
  /**
   * The IDs of the types of products to remove association with this tax rate
   */
  product_types: Array<string>
}
