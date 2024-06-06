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
  location_levels?: InventoryLevelDTO[]
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
  allow_backorder?: boolean
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
  available_quantity: number
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
 */
export type FilterableReservationItemProps = {
  /**
   * The IDs to filter reservation items by.
   */
  id?: string | string[]
  /**
   * @ignore
   *
   * @privateRemark
   * This property is not used.
   */
  type?: string | string[]
  /**
   * Filter reservation items by the ID of their associated line item.
   */
  line_item_id?: string | string[]
  /**
   * Filter reservation items by the ID of their associated inventory item.
   */
  inventory_item_id?: string | string[]
  /**
   * Filter reservation items by the ID of their associated location.
   */
  location_id?: string | string[]
  /**
   * Description filters to apply on the reservation items' `description` attribute.
   */
  description?: string | StringComparisonOperator
  /**
   * The "created by" values to filter reservation items by.
   */
  created_by?: string | string[]
  /**
   * Filters to apply on the reservation items' `quantity` attribute.
   */
  quantity?: number | NumericalComparisonOperator
}

/**
 * @interface
 *
 * The filters to apply on retrieved inventory items.
 */
export type FilterableInventoryItemProps = {
  /**
   * The IDs to filter inventory items by.
   */
  id?: string | string[]
  /**
   * Filter inventory items by the ID of their associated location.
   */
  location_id?: string | string[]
  /**
   * Search term to search inventory items' attributes.
   */
  q?: string
  /**
   * The SKUs to filter inventory items by.
   */
  sku?: string | string[] | StringComparisonOperator
  /**
   * The origin country to filter inventory items by.
   */
  origin_country?: string | string[]
  /**
   * The HS Codes to filter inventory items by.
   */
  hs_code?: string | string[] | StringComparisonOperator
  /**
   * Filter inventory items by whether they require shipping.
   */
  requires_shipping?: boolean
}

export interface UpdateInventoryItemInput
  extends Partial<CreateInventoryItemInput> {
  id: string
}
/**
 * @interface
 *
 * The details of the inventory item to be created.
 */
export interface CreateInventoryItemInput {
  /**
   * The SKU of the inventory item.
   */
  sku?: string | null
  /**
   * The origin country of the inventory item.
   */
  origin_country?: string | null
  /**
   * The MID code of the inventory item.
   */
  mid_code?: string | null
  /**
   * The material of the inventory item.
   */
  material?: string | null
  /**
   * The weight of the inventory item.
   */
  weight?: number | null
  /**
   * The length of the inventory item.
   */
  length?: number | null
  /**
   * The height of the inventory item.
   */
  height?: number | null
  /**
   * The width of the inventory item.
   */
  width?: number | null
  /**
   * The title of the inventory item.
   */
  title?: string | null
  /**
   * The description of the inventory item.
   */
  description?: string | null
  /**
   * The thumbnail of the inventory item.
   */
  thumbnail?: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The HS code of the inventory item.
   */
  hs_code?: string | null
  /**
   * Whether the inventory item requires shipping.
   */
  requires_shipping?: boolean
}

/**
 * @interface
 *
 * The details of the reservation item to be created.
 */
export type CreateReservationItemInput = {
  /**
   * The ID of the associated line item.
   */
  line_item_id?: string
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the associated location.
   */
  location_id: string
  /**
   * The reserved quantity.
   */
  quantity: number
  /**
   * The description of the reservation.
   */
  description?: string
  /**
   * The user or system that created the reservation. Can be any form of identification string.
   */
  created_by?: string
  /**
   * An ID associated with an external third-party system that the reservation item is connected to.
   */
  external_id?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * @interface
 *
 * The filters to apply on retrieved inventory levels.
 */
export type FilterableInventoryLevelProps = {
  /**
   * Filter inventory levels by the ID of their associated inventory item.
   */
  inventory_item_id?: string | string[]
  /**
   * Filter inventory levels by the ID of their associated inventory location.
   */
  location_id?: string | string[]
  /**
   * Filters to apply on inventory levels' `stocked_quantity` attribute.
   */
  stocked_quantity?: number | NumericalComparisonOperator
  /**
   * Filters to apply on inventory levels' `reserved_quantity` attribute.
   */
  reserved_quantity?: number | NumericalComparisonOperator
  /**
   * Filters to apply on inventory levels' `incoming_quantity` attribute.
   */
  incoming_quantity?: number | NumericalComparisonOperator
}

/**
 * @interface
 *
 * The details of the inventory level to be created.
 */
export type CreateInventoryLevelInput = {
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the associated location.
   */
  location_id: string
  /**
   * The stocked quantity of the associated inventory item in the associated location.
   */
  stocked_quantity: number
  /**
   * The reserved quantity of the associated inventory item in the associated location.
   */
  reserved_quantity?: number
  /**
   * The incoming quantity of the associated inventory item in the associated location.
   */
  incoming_quantity?: number
}

/**
 * @interface
 *
 * The attributes to update in an inventory level.
 */
export type UpdateInventoryLevelInput = {
  /**
   * The stocked quantity of the associated inventory item in the associated location.
   */
  stocked_quantity?: number
  /**
   * The incoming quantity of the associated inventory item in the associated location.
   */
  incoming_quantity?: number
}

/**
 * @interface
 *
 * The attributes to update in an inventory level. The inventory level is identified by the IDs of its associated inventory item and location.
 */
export type BulkUpdateInventoryLevelInput = {
  /**
   * The ID of the associated inventory level.
   */
  inventory_item_id: string
  /**
   * The ID of the associated location.
   */
  location_id: string
} & UpdateInventoryLevelInput

/**
 * @interface
 *
 * The attributes to update in a reservation item.
 */
export type UpdateReservationItemInput = {
  /**
   * The reserved quantity.
   */
  quantity?: number
  /**
   * The ID of the associated location.
   */
  location_id?: string
  /**
   * The description of the reservation item.
   */
  description?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

export type ReserveQuantityContext = {
  locationId?: string
  lineItemId?: string
  salesChannelId?: string | null
}
