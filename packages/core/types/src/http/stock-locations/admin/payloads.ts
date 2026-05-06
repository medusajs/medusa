export interface AdminCreateStockLocation {
  /**
   * The name of the stock location.
   */
  name: string
  /**
   * The ID of the address to associate with the stock location.
   * If you provide an `address`, you don't need to provide this property.
   */
  address_id?: string | null
  /**
   * The address to create or update for the stock location.
   * If you provide an `address_id`, you don't need
   * to provide this property.
   */
  address?: AdminUpsertStockLocationAddress
  /**
   * Custom key-value pairs that can be added to the stock location.
   */
  metadata?: Record<string, unknown> | null
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
  address_id?: string | null
  /**
   * The address to create or update for the stock location.
   * If you provide an `address_id`, you don't need
   * to provide this property.
   */
  address?: AdminUpsertStockLocationAddress
  /**
   * Custom key-value pairs that can be added to the stock location.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * Sales channels to associate or disassociate from a stock location.
 */
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

/**
 * Data for creating a fulfillment set for a stock location.
 */
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

export interface AdminUpsertStockLocationAddress {
  country_code: string
  address_1: string
  metadata?: Record<string, unknown> | null | undefined
  address_2?: string | null | undefined
  company?: string | null | undefined
  city?: string | null | undefined
  phone?: string | null | undefined
  postal_code?: string | null | undefined
  province?: string | null | undefined
}
