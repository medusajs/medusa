import { NumericalComparisonOperator, StringComparisonOperator } from "./common"

export type InventoryItemDTO = {
  id: string
  sku: string
  origin_country: string
  hs_code: string
  requires_shipping: boolean
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date
}

export type InventoryLevelDTO = {
  id: string
  item_id: string
  location_id: string
  stocked_quantity: number
  incoming_quantity: number
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date
}

export type StockLocationAddressDTO = {
  id: string
  address_1: string
  address_2: string
  city: string
  country_code: string
  phone: string
  postal_code: string
  province: string
}

export type StockLocationDTO = {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  address_id: string
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date
}

export type FilterableInventoryItemProps = {
  sku?: string | string[] | StringComparisonOperator
  origin_country?: string | string[]
  hs_code?: number | number[] | NumericalComparisonOperator
  requires_shipping?: boolean
}

export type CreateInventoryItemInput = {
  sku?: string
  origin_country?: string
  metadata?: Record<string, unknown> | null
  hs_code?: number
  requires_shipping?: boolean
}

export type FilterableInventoryLevelProps = {
  item_id?: string | string[]
  location_id?: string | string[]
  stocked_quantity?: number | NumericalComparisonOperator
  incoming_quantity?: number | NumericalComparisonOperator
}

export type CreateInventoryLevelInput = {
  item_id: string
  location_id: string
  stocked_quantity: number
  incoming_quantity: number
}

export type FilterableLocationProps = {
  id?: string | string[]
  name?: string | string[] | StringComparisonOperator
}

export type LocationAddressInput = {
  address_1: string
  address_2?: string
  city: string
  country_code: string
  phone: string
  province: string
  postal_code: string
}

export type CreateLocationInput = {
  name: string
  address: string | LocationAddressInput
}

export type UpdateLocationInput = {
  name?: string
  address?: string | LocationAddressInput
}
