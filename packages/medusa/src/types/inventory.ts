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

/**
 * @schema ReservationItemDTO
 * title: "Reservation item"
 * description: "Represents a reservation of an inventory item at a stock location"
 * type: object
 * required:
 * - id
 * - location_id
 * - inventory_item_id
 * - quantity
 * properties:
 *   id:
 *     description: "The id of the reservation item"
 *     type: string
 *   location_id:
 *     description: "The id of the location of the reservation"
 *     type: string
 *   inventory_item_id:
 *     description: "The id of the inventory item the reservation relates to"
 *     type: string
 *   quantity:
 *     description: "The id of the reservation item"
 *     type: number
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 */
export type ReservationItemDTO = {
  id: string
  location_id: string
  inventory_item_id: string
  quantity: number
  line_item_id?: string | null
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
}

export type InventoryLevelDTO = {
  id: string
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity: number
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
  inventory_item_id?: string | string[]
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
  inventory_item_id: string
  location_id: string
  quantity: number
  metadata?: Record<string, unknown> | null
}

export type FilterableInventoryLevelProps = {
  inventory_item_id?: string | string[]
  location_id?: string | string[]
  stocked_quantity?: number | NumericalComparisonOperator
  reserved_quantity?: number | NumericalComparisonOperator
  incoming_quantity?: number | NumericalComparisonOperator
}

export type CreateInventoryLevelInput = {
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity?: number
  incoming_quantity?: number
}

export type UpdateInventoryLevelInput = {
  stocked_quantity?: number
  incoming_quantity?: number
}

export type UpdateReservationItemInput = {
  quantity?: number
  location_id?: string
  metadata?: Record<string, unknown> | null
}

export type ReserveQuantityContext = {
  locationId?: string
  lineItemId?: string
  salesChannelId?: string | null
}
