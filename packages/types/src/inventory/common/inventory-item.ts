import { StringComparisonOperator } from "../../common"

/**
 * The inventory item details.
 */
export interface InventoryItemDTO {
  /**
   * The ID of the inventory item.
   */
  id: string

  /**
   * The SKU of the inventory item.
   */
  sku?: string | null

  /**
   * The origin country of the inventory item.
   */
  origin_country?: string | null

  /**
   * The HS code of the inventory item.
   */
  hs_code?: string | null

  /**
   * Whether the inventory item requires shipping.
   */
  requires_shipping: boolean

  /**
   * The mid code of the inventory item.
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
   * The creation date of the inventory item.
   */
  created_at: string | Date

  /**
   * The update date of the inventory item.
   */
  updated_at: string | Date

  /**
   * The deletion date of the inventory item.
   */
  deleted_at: string | Date | null
}

/**
 * @interface
 *
 * The filters to apply on retrieved inventory items.
 */
export interface FilterableInventoryItemProps {
  /**
   * Search term to search inventory items' attributes.
   */
  q?: string

  /**
   * The IDs to filter inventory items by.
   */
  id?: string | string[]

  /**
   * Filter inventory items by the ID of their associated location.
   */
  location_id?: string | string[]

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
