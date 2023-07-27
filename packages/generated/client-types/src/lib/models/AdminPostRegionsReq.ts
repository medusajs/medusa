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
   * The 3 character ISO currency code to use in the Region.
   */
  currency_code: string
  /**
   * The tax code of the Region.
   */
  tax_code?: string
  /**
   * The tax rate to use in the Region.
   */
  tax_rate: number
  /**
   * A list of Payment Provider IDs that can be used in the Region
   */
  payment_providers: Array<string>
  /**
   * A list of Fulfillment Provider IDs that can be used in the Region
   */
  fulfillment_providers: Array<string>
  /**
   * A list of countries' 2 ISO characters that should be included in the Region.
   */
  countries: Array<string>
  /**
   * Whether taxes are included in the prices of the region.
   */
  includes_tax?: boolean
}
