/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeleteTaxRatesTaxRateProductsReq {
  /**
   * The IDs of the products to remove association with this tax rate
   */
  products: Array<string>
}
