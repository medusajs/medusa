import { NumericalComparisonOperator, StringComparisonOperator } from "./common"

export type InventoryItemDTO = {
  id: string
  sku?: string | null
  origin_country?: string | null
  hs_code?: string | null
  requires_shipping: boolean
  mid_code?: string | null
  material?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
}

export type ReservationItemDTO = {
  id: string
  location_id: string
  item_id: string
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

export type FilterableReservationItemProps = {
  id?: string | string[]
  type?: string | string[]
  line_item_id?: string | string[]
  item_id?: string | string[]
  location_id?: string | string[]
  quantity?: number | NumericalComparisonOperator
}

export type FilterableInventoryItemProps = {
  id?: string | string[]
  location_id?: string | string[]
  q?: string
  sku?: string | string[] | StringComparisonOperator
  origin_country?: string | string[]
  hs_code?: string | string[] | StringComparisonOperator
  requires_shipping?: boolean
}

export type CreateInventoryItemInput = {
  sku?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  metadata?: Record<string, unknown> | null
  hs_code?: string
  requires_shipping?: boolean
}

export type CreateReservationItemInput = {
  type?: string
  line_item_id?: string
  item_id: string
  location_id: string
  quantity: number
  metadata?: Record<string, unknown> | null
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

export type UpdateInventoryLevelInput = {
  stocked_quantity?: number
  incoming_quantity?: number
}

export type ReserveQuantityContext = {
  locationId?: string
  lineItemId?: string
  salesChannelId?: string | null
}
