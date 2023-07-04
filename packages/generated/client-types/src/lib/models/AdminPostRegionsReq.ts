/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostRegionsReq {
  /**
   * The name of the Region
   */
  name: string
  /**
   * The 3 character ISO currency code to use for the Region.
   */
  currency_code: string
  /**
   * An optional tax code the Region.
   */
  tax_code?: string
  /**
   * The tax rate to use on Orders in the Region.
   */
  tax_rate: number
  /**
   * A list of Payment Provider IDs that should be enabled for the Region
   */
  payment_providers: Array<string>
  /**
   * A list of Fulfillment Provider IDs that should be enabled for the Region
   */
  fulfillment_providers: Array<string>
  /**
   * A list of countries' 2 ISO Characters that should be included in the Region.
   */
  countries: Array<string>
  /**
   * [EXPERIMENTAL] Tax included in prices of region
   */
  includes_tax?: boolean
}
