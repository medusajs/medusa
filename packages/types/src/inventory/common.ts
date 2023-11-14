import {
  NumericalComparisonOperator,
  StringComparisonOperator,
} from "../common"

/**
 * @schema InventoryItemDTO
 * type: object
 * required:
 *   - sku
 * properties:
 *   id:
 *     description: The inventory item's ID.
 *     type: string
 *     example: "iitem_12334"
 *   sku:
 *     description: The Stock Keeping Unit (SKU) code of the Inventory Item.
 *     type: string
 *   hs_code:
 *     description: The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   origin_country:
 *     description: The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   mid_code:
 *     description: The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   title:
 *     description: "Title of the inventory item"
 *     type: string
 *   description:
 *     description: "Description of the inventory item"
 *     type: string
 *   thumbnail:
 *     description: "Thumbnail for the inventory item"
 *     type: string
 *   material:
 *     description: The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   weight:
 *     description: The weight of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   height:
 *     description: The height of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   width:
 *     description: The width of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   length:
 *     description: The length of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   requires_shipping:
 *     description: Whether the item requires shipping.
 *     type: boolean
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
  title?: string | null
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
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
 *   description:
 *     description: "Description of the reservation item"
 *     type: string
 *   created_by:
 *     description: "UserId of user who created the reservation item"
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
  description?: string | null
  created_by?: string | null
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
}

/**
 * @schema InventoryLevelDTO
 * type: object
 * required:
 *   - inventory_item_id
 *   - location_id
 *   - stocked_quantity
 *   - reserved_quantity
 *   - incoming_quantity
 * properties:
 *   location_id:
 *     description: the item location ID
 *     type: string
 *   stocked_quantity:
 *     description: the total stock quantity of an inventory item at the given location ID
 *     type: number
 *   reserved_quantity:
 *     description: the reserved stock quantity of an inventory item at the given location ID
 *     type: number
 *   incoming_quantity:
 *     description: the incoming stock quantity of an inventory item at the given location ID
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

/**
 * @interface
 * 
 * The filters to apply on retrieved reservation items.
 * 
 * @prop id - The IDs to filter reservation items by.
 * @prop type - The types to filter reservation items by.
 * @prop line_item_id - Filter reservation items by the ID of their associated line item.
 * @prop inventory_item_id - Filter reservation items by the ID of their associated inventory item.
 * @prop location_id - Filter reservation items by the ID of their associated location.
 * @prop description - Description filters to apply on the reservation items' `description` attribute.
 * @prop created_by - The "created by" values to filter reservation items by.
 * @prop quantity - Filters to apply on the reservation items' `quantity` attribute.
 */
export type FilterableReservationItemProps = {
  id?: string | string[]
  type?: string | string[]
  line_item_id?: string | string[]
  inventory_item_id?: string | string[]
  location_id?: string | string[]
  description?: string | StringComparisonOperator
  created_by?: string | string[]
  quantity?: number | NumericalComparisonOperator
}

/**
 * @interface
 * 
 * The filters to apply on retrieved inventory items.
 * 
 * @prop id - The IDs to filter inventory items by.
 * @prop location_id - Filter inventory items by the ID of their associated location.
 * @prop q - Search term to search inventory items' attributes.
 * @prop sku - The SKUs to filter inventory items by.
 * @prop origin_country - The origin country to filter inventory items by.
 * @prop hs_code - The HS Codes to filter inventory items by.
 * @prop requires_shipping - Filter inventory items by whether they require shipping.
 */
export type FilterableInventoryItemProps = {
  id?: string | string[]
  location_id?: string | string[]
  q?: string
  sku?: string | string[] | StringComparisonOperator
  origin_country?: string | string[]
  hs_code?: string | string[] | StringComparisonOperator
  requires_shipping?: boolean
}

/**
 * @interface
 * 
 * The details of the inventory item to be created.
 * 
 * @prop sku - The SKU of the inventory item.
 * @prop origin_country - The origin country of the inventory item.
 * @prop mid_code - The MID code of the inventory item.
 * @prop material - The material of the inventory item.
 * @prop weight - The weight of the inventory item.
 * @prop length - The length of the inventory item.
 * @prop height - The height of the inventory item.
 * @prop width - The width of the inventory item.
 * @prop title - The title of the inventory item.
 * @prop description - The description of the inventory item.
 * @prop thumbnail - The thumbnail of the inventory item.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop hs_code - The HS code of the inventory item.
 * @prop requries_shipping - Whether the inventory item requires shipping.
 */
export type CreateInventoryItemInput = {
  sku?: string | null
  origin_country?: string | null
  mid_code?: string | null
  material?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  title?: string | null
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
  hs_code?: string | null
  requires_shipping?: boolean
}

/**
 * @interface
 * 
 * The details of the reservation item to be created.
 * 
 * @prop line_item_id - The ID of the associated line item.
 * @prop inventory_item_id - The ID of the associated inventory item.
 * @prop location_id - The ID of the associated location.
 * @prop quantity - The reserved quantity.
 * @prop description - The description of the reservation.
 * @prop created_by - The user or system that created the reservation. Can be any form of identification string.
 * @prop external_id - An ID associated with an external third-party system that the reservation item is connected to.
 * @prop metadata - Holds custom data in key-value pairs.
 */
export type CreateReservationItemInput = {
  line_item_id?: string
  inventory_item_id: string
  location_id: string
  quantity: number
  description?: string
  created_by?: string
  external_id?: string
  metadata?: Record<string, unknown> | null
}

/**
 * @interface
 * 
 * The filters to apply on retrieved inventory levels.
 * 
 * @prop inventory_item_id - Filter inventory levels by the ID of their associated inventory item.
 * @prop location_id - Filter inventory levels by the ID of their associated inventory location.
 * @prop stocked_quantity - Filters to apply on inventory levels' `stocked_quantity` attribute.
 * @prop reserved_quantity - Filters to apply on inventory levels' `reserved_quantity` attribute.
 * @prop incoming_quantity - Filters to apply on inventory levels' `incoming_quantity` attribute.
 */
export type FilterableInventoryLevelProps = {
  inventory_item_id?: string | string[]
  location_id?: string | string[]
  stocked_quantity?: number | NumericalComparisonOperator
  reserved_quantity?: number | NumericalComparisonOperator
  incoming_quantity?: number | NumericalComparisonOperator
}

/**
 * @interface
 * 
 * The details of the inventory level to be created.
 * 
 * @prop inventory_item_id - The ID of the associated inventory item.
 * @prop location_id - The ID of the associated location.
 * @prop stocked_quantity - The stocked quantity of the associated inventory item in the associated location.
 * @prop reserved_quantity - The reserved quantity of the associated inventory item in the associated location.
 * @prop incoming_quantity - The incoming quantity of the associated inventory item in the associated location.
 */
export type CreateInventoryLevelInput = {
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity?: number
  incoming_quantity?: number
}

/**
 * @interface
 * 
 * The attributes to update in an inventory level.
 * 
 * @prop stocked_quantity - The stocked quantity of the associated inventory item in the associated location.
 * @prop incoming_quantity - The incoming quantity of the associated inventory item in the associated location.
 */
export type UpdateInventoryLevelInput = {
  stocked_quantity?: number
  incoming_quantity?: number
}

/**
 * @interface
 * 
 * The attributes to update in an inventory level. The inventory level is identified by the IDs of its associated inventory item and location.
 * 
 * @prop inventory_item_id - The ID of the associated inventory level.
 * @prop location_id - The ID of the associated location.
 */
export type BulkUpdateInventoryLevelInput = {
  inventory_item_id: string
  location_id: string
} & UpdateInventoryLevelInput

/**
 * @interface
 * 
 * The attributes to update in a reservation item.
 * 
 * @prop quantity - The reserved quantity.
 * @prop location_id - The ID of the associated location.
 * @prop description - The description of the reservation item.
 * @prop metadata - Holds custom data in key-value pairs.
 */
export type UpdateReservationItemInput = {
  quantity?: number
  location_id?: string
  description?: string
  metadata?: Record<string, unknown> | null
}

export type ReserveQuantityContext = {
  locationId?: string
  lineItemId?: string
  salesChannelId?: string | null
}
