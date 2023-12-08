/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostTaxRatesTaxRateReq {
  /**
   * The code of the tax rate.
   */
  code?: string
  /**
   * The name of the tax rate.
   */
  name?: string
  /**
   * The ID of the Region that the tax rate belongs to.
   */
  region_id?: string
  /**
   * The numeric rate to charge.
   */
  rate?: number
  /**
   * The IDs of the products associated with this tax rate
   */
  products?: Array<string>
  /**
   * The IDs of the shipping options associated with this tax rate
   */
  shipping_options?: Array<string>
  /**
   * The IDs of the types of product types associated with this tax rate
   */
  product_types?: Array<string>
}
