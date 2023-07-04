/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeleteTaxRatesTaxRateShippingOptionsReq {
  /**
   * The IDs of the shipping options to remove association with this tax rate
   */
  shipping_options: Array<string>
}
