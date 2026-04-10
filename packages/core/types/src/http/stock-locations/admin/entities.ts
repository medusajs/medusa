import { AdminFulfillmentProvider } from "../../fulfillment-provider"
import { AdminFulfillmentSet } from "../../fulfillment-set"
import { AdminSalesChannel } from "../../sales-channel"

/**
 * Stock location address details.
 */
export interface AdminStockLocationAddress {
  /**
   * The ID of the stock location address.
   */
  id: string
  /**
   * The first address line of the stock location.
   */
  address_1: string
  /**
   * The second address line of the stock location.
   */
  address_2: string | null
  /**
   * The company name associated with the stock location address.
   */
  company: string | null
  /**
   * The country code of the stock location address.
   */
  country_code: string
  /**
   * The city of the stock location address.
   */
  city: string | null
  /**
   * The phone number of the stock location address.
   */
  phone: string | null
  /**
   * The postal code of the stock location address.
   */
  postal_code: string | null
  /**
   * The province of the stock location address.
   */
  province: string | null
  /**
   * The metadata associated with the stock location address.
   */
  metadata: Record<string, unknown> | null
}

export interface AdminStockLocation {
  /**
   * The ID of the stock location.
   */
  id: string
  /**
   * The name of the stock location.
   */
  name: string
  /**
   * The metadata associated with the stock location.
   * 
   * @since 2.13.7
   */
  metadata: Record<string, unknown> | null
  /**
   * The ID of the address associated with the stock location.
   */
  address_id: string
  /**
   * The address associated with the stock location.
   */
  address?: AdminStockLocationAddress
  /**
   * The sales channels associated with the stock location.
   */
  sales_channels?: AdminSalesChannel[]
  /**
   * The fulfillment providers associated with the stock location.
   */
  fulfillment_providers?: AdminFulfillmentProvider[]
  /**
   * The fulfillment sets associated with the stock location.
   */
  fulfillment_sets?: AdminFulfillmentSet[]
}
