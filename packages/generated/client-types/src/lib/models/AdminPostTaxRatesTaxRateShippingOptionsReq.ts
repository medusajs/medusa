/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostTaxRatesTaxRateShippingOptionsReq {
  /**
   * The IDs of the shipping options to associate with this tax rate
   */
  shipping_options: Array<string>
}
