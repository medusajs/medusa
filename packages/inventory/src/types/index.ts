import {
  NumericalComparisonOperator,
  StringComparisonOperator,
} from "@medusajs/medusa"

export interface IEventBusService {
  emit(event: string, data: any): Promise<void>
}

export type FilterableInventoryItemProps = {
  sku?: string | string[] | StringComparisonOperator
  origin_country?: string | string[]
  metadata?: Record<string, unknown>
  hs_code?: number | number[] | NumericalComparisonOperator
  requires_shipping?: boolean
}

export type CreateInventoryItemInput = {
  sku?: string
  origin_country?: string
  metadata?: Record<string, unknown>
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
