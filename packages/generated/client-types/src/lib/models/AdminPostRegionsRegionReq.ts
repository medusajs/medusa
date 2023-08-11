/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostRegionsRegionReq {
  /**
   * The name of the Region
   */
  name?: string
  /**
   * The 3 character ISO currency code to use in the Region.
   */
  currency_code?: string
  /**
   * If set to `true`, the Medusa backend will automatically calculate taxes for carts in this region. If set to `false`, the taxes must be calculated manually.
   */
  automatic_taxes?: boolean
  /**
   * If set to `true`, taxes will be applied on gift cards.
   */
  gift_cards_taxable?: boolean
  /**
   * The ID of the tax provider to use. If none provided, the system tax provider is used.
   */
  tax_provider_id?: string
  /**
   * The tax code of the Region.
   */
  tax_code?: string
  /**
   * The tax rate to use in the Region.
   */
  tax_rate?: number
  /**
   * Whether taxes are included in the prices of the region.
   */
  includes_tax?: boolean
  /**
   * A list of Payment Provider IDs that can be used in the Region
   */
  payment_providers?: Array<string>
  /**
   * A list of Fulfillment Provider IDs that can be used in the Region
   */
  fulfillment_providers?: Array<string>
  /**
   * A list of countries' 2 ISO characters that should be included in the Region.
   */
  countries?: Array<string>
}
