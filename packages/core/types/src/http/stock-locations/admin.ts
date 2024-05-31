import {
  BaseHttpFilterableWithDeletedAt,
  BaseSoftDeletableHttpEntity,
} from "../base"
import { AdminFulfillmentSet } from "../fulfillment-set"
import { AdminSalesChannel } from "../sales-channel"

export interface AdminStockLocationAddress extends BaseSoftDeletableHttpEntity {
  /**
   * The first line of the address
   */
  address_1: string
  /**
   * The second line of the address
   */
  address_2: string | null
  /**
   * The name of the company at the address
   */
  company: string | null
  /**
   * The country code of the address
   */
  country_code: string
  /**
   * The city of the address
   */
  city: string | null
  /**
   * The phone number of the address
   */
  phone: string | null
  /**
   * The postal code of the address
   */
  postal_code: string | null
  /**
   * The province or state of the address
   */
  province: string | null
}

export interface AdminStockLocation extends BaseSoftDeletableHttpEntity {
  /**
   * The name of the stock location
   */
  name: string
  /**
   * The ID of the address associated with the stock location
   */
  address_id: string
  /**
   * The address associated with the stock location.
   */
  address?: AdminStockLocationAddress
  /**
   * The sales channels associated with the stock location.
   */
  sales_channels?: AdminSalesChannel[] | null
  /**
   * The fulfillment sets associated with the stock location.
   */
  fulfillment_sets: AdminFulfillmentSet[]
}

export interface AdminUpsertStockLocationAddress {
  address_1: string
  address_2?: string
  company?: string
  country_code: string
  city?: string
  phone?: string
  postal_code?: string
  province?: string
}

export interface AdminCreateStockLocation {
  name: string
  address_id?: string
  address?: AdminUpsertStockLocationAddress
  metadata?: Record<string, unknown>
}

export interface AdminUpdateStockLocation {
  name?: string
  address_id?: string
  address?: AdminUpsertStockLocationAddress
  metadata?: Record<string, unknown>
}

export interface AdminStockLocationFilters
  extends BaseHttpFilterableWithDeletedAt<AdminStockLocationFilters> {
  /**
   * A name or an array of names to filter results by.
   */
  name?: string | string[]
  /**
   * An address ID or an array of address IDs to filter results by.
   */
  address_id?: string | string[]
  /**
   * A sales channel ID or an array of sales channel IDs to filter results by.
   */
  sales_channel_id?: string | string[]
}

export interface AdminUpdateStockLocationSalesChannels {
  /**
   * An array of sales channel IDs to associate with the stock location.
   */
  add?: string[]
  /**
   * An array of sales channel IDs to remove their association with the stock location.
   */
  remove?: string[]
}

export interface AdminCreateStockLocationFulfillmentSet {
  name: string
  type: string
}
