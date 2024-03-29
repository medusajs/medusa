import { StringComparisonOperator } from "../../common"

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
export interface InventoryItemDTO {
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
 * @interface
 *
 * The filters to apply on retrieved inventory items.
 */
export interface FilterableInventoryItemProps {
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
