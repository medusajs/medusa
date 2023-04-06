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
   * The 3 character ISO currency code to use for the Region.
   */
  currency_code?: string
  /**
   * If true Medusa will automatically calculate taxes for carts in this region. If false you have to manually call POST /carts/:id/taxes.
   */
  automatic_taxes?: boolean
  /**
   * Whether gift cards in this region should be applied sales tax when purchasing a gift card
   */
  gift_cards_taxable?: boolean
  /**
   * The ID of the tax provider to use; if null the system tax provider is used
   */
  tax_provider_id?: string
  /**
   * An optional tax code the Region.
   */
  tax_code?: string
  /**
   * The tax rate to use on Orders in the Region.
   */
  tax_rate?: number
  /**
   * [EXPERIMENTAL] Tax included in prices of region
   */
  includes_tax?: boolean
  /**
   * A list of Payment Provider IDs that should be enabled for the Region
   */
  payment_providers?: Array<string>
  /**
   * A list of Fulfillment Provider IDs that should be enabled for the Region
   */
  fulfillment_providers?: Array<string>
  /**
   * A list of countries' 2 ISO Characters that should be included in the Region.
   */
  countries?: Array<string>
}
