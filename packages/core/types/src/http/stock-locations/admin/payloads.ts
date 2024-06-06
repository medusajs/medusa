interface AdminUpsertStockLocationAddress {
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

export interface AdminUpdateStockLocationSalesChannels {
  add?: string[]
  remove?: string[]
}

export interface AdminCreateStockLocationFulfillmentSet {
  name: string
  type: string
}
