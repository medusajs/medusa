/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Country } from "./Country"
import type { Currency } from "./Currency"
import type { FulfillmentProvider } from "./FulfillmentProvider"
import type { PaymentProvider } from "./PaymentProvider"
import type { TaxProvider } from "./TaxProvider"
import type { TaxRate } from "./TaxRate"

/**
 * A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries.
 */
export interface Region {
  /**
   * The region's ID
   */
  id: string
  /**
   * The name of the region as displayed to the customer. If the Region only has one country it is recommended to write the country name.
   */
  name: string
  /**
   * The three character currency code used in the region.
   */
  currency_code: string
  /**
   * The details of the currency used in the region.
   */
  currency?: Currency | null
  /**
   * The tax rate that should be charged on purchases in the Region.
   */
  tax_rate: number
  /**
   * The details of the tax rates used in the region, aside from the default rate.
   */
  tax_rates?: Array<TaxRate>
  /**
   * The tax code used on purchases in the Region. This may be used by other systems for accounting purposes.
   */
  tax_code: string | null
  /**
   * Whether the gift cards are taxable or not in this region.
   */
  gift_cards_taxable: boolean
  /**
   * Whether taxes should be automated in this region.
   */
  automatic_taxes: boolean
  /**
   * The details of the countries included in this region.
   */
  countries?: Array<Country>
  /**
   * The ID of the tax provider used in this region
   */
  tax_provider_id: string | null
  /**
   * The details of the tax provider used in the region.
   */
  tax_provider?: TaxProvider | null
  /**
   * The details of the payment providers that can be used to process payments in the region.
   */
  payment_providers?: Array<PaymentProvider>
  /**
   * The details of the fulfillment providers that can be used to fulfill items of orders and similar resources in the region.
   */
  fulfillment_providers?: Array<FulfillmentProvider>
  /**
   * Whether the prices for the region include tax
   */
  includes_tax?: boolean
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
