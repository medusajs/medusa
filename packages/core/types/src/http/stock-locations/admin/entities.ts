import { AdminFulfillmentProvider } from "../../fulfillment-provider"
import { AdminFulfillmentSet } from "../../fulfillment-set"
import { AdminSalesChannel } from "../../sales-channel"

export interface AdminStockLocationAddress {
  id: string
  address_1: string
  address_2: string | null
  company: string | null
  country_code: string
  city: string | null
  phone: string | null
  postal_code: string | null
  province: string | null
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
