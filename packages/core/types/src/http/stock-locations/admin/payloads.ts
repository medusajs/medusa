interface AdminUpsertStockLocationAddress {
  /**
   * The first line of the address.
   */
  address_1: string
  /**
   * The second line of the address.
   */
  address_2?: string
  /**
   * The company name associated with the address.
   */
  company?: string
  /**
   * The country code of the address.
   *
   * @example
   * "us"
   */
  country_code: string
  /**
   * The city of the address.
   */
  city?: string
  /**
   * The phone number of the address.
   */
  phone?: string
  /**
   * The postal or zip code of the address.
   */
  postal_code?: string
  /**
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province or state of the address.
   */
  province?: string

  /**
   * Custom key-value pairs that can be added to the address.
   */
  metadata?: Record<string, unknown>
}

export interface AdminCreateStockLocation {
  /**
   * The name of the stock location.
   */
  name: string
  /**
   * The ID of the address to associate with the stock location.
   * If you provide an `address`, you don't need to provide this property.
   */
  address_id?: string
  /**
   * The address to create or update for the stock location.
   * If you provide an `address_id`, you don't need
   * to provide this property.
   */
  address?: AdminUpsertStockLocationAddress
  /**
   * Custom key-value pairs that can be added to the stock location.
   */
  metadata?: Record<string, unknown>
}

export interface AdminUpdateStockLocation {
  /**
   * The name of the stock location.
   */
  name?: string
  /**
   * The ID of the address to associate with the stock location.
   * If you provide an `address`, you don't need to provide this property.
   */
  address_id?: string
  /**
   * The address to create or update for the stock location.
   * If you provide an `address_id`, you don't need
   * to provide this property.
   */
  address?: AdminUpsertStockLocationAddress
  /**
   * Custom key-value pairs that can be added to the stock location.
   */
  metadata?: Record<string, unknown>
}

export interface AdminUpdateStockLocationSalesChannels {
  /**
   * The IDs of the sales channels to add to the stock location.
   */
  add?: string[]
  /**
   * The IDs of the sales channels to remove from the stock location.
   */
  remove?: string[]
}

export interface AdminCreateStockLocationFulfillmentSet {
  /**
   * The name of the fulfillment set.
   */
  name: string
  /**
   * The type of the fulfillment set.
   */
  type: string
}
