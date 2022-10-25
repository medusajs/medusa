import { StringComparisonOperator } from "./common"

export type StockLocationAddressDTO = {
  id?: string
  address_1: string
  address_2?: string
  city?: string
  country_code?: string
  phone?: string
  postal_code?: string
  province?: string
}

export type StockLocationDTO = {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  address_id: string
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
}

export type FilterableStockLocationProps = {
  id?: string | string[]
  name?: string | string[] | StringComparisonOperator
}

export type StockLocationAddressInput = {
  address_1: string
  address_2?: string
  city?: string
  country_code?: string
  phone?: string
  province?: string
  postal_code?: string
}

export type CreateStockLocationInput = {
  name: string
  address?: string | StockLocationAddressInput
}

export type UpdateStockLocationInput = {
  name?: string
  address_id?: string
  address?: StockLocationAddressInput
}
