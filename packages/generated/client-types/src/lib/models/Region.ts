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
 * Regions hold settings for how Customers in a given geographical location shop. The is, for example, where currencies and tax rates are defined. A Region can consist of multiple countries to accomodate common shopping settings across countries.
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
   * The 3 character currency code that the Region uses.
   */
  currency_code: string
  /**
   * Available if the relation `currency` is expanded.
   */
  currency?: Currency | null
  /**
   * The tax rate that should be charged on purchases in the Region.
   */
  tax_rate: number
  /**
   * The tax rates that are included in the Region. Available if the relation `tax_rates` is expanded.
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
   * The countries that are included in the Region. Available if the relation `countries` is expanded.
   */
  countries?: Array<Country>
  /**
   * The ID of the tax provider used in this region
   */
  tax_provider_id: string | null
  /**
   * Available if the relation `tax_provider` is expanded.
   */
  tax_provider?: TaxProvider | null
  /**
   * The Payment Providers that can be used to process Payments in the Region. Available if the relation `payment_providers` is expanded.
   */
  payment_providers?: Array<PaymentProvider>
  /**
   * The Fulfillment Providers that can be used to fulfill orders in the Region. Available if the relation `fulfillment_providers` is expanded.
   */
  fulfillment_providers?: Array<FulfillmentProvider>
  /**
   * [EXPERIMENTAL] Does the prices for the region include tax
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
