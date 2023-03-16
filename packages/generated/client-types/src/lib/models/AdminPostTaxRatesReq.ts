/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostTaxRatesReq {
  /**
   * A code to identify the tax type by
   */
  code: string
  /**
   * A human friendly name for the tax
   */
  name: string
  /**
   * The ID of the Region that the rate belongs to
   */
  region_id: string
  /**
   * The numeric rate to charge
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
   * The IDs of the types of products associated with this tax rate
   */
  product_types?: Array<string>
}
