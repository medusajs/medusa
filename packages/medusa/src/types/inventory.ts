import { NumericalComparisonOperator, StringComparisonOperator } from "./common"

export type InventoryItemDTO = {
  id: string
  sku: string
  origin_country: string
  hs_code: number
  requires_shipping: boolean
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
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
  deleted_at: string | Date | null
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
