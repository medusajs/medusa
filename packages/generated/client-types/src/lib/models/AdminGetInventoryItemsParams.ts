/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetInventoryItemsParams {
  /**
   * The number of inventory items to skip when retrieving the inventory items.
   */
  offset?: number
  /**
   * Limit the number of inventory items returned.
   */
  limit?: number
  /**
   * Comma-separated relations that should be expanded in each returned inventory item.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned inventory item.
   */
  fields?: string
  /**
   * term to search inventory item's sku, title, and description.
   */
  q?: string
  /**
   * Field to sort-order inventory items by.
   */
  order?: string
  /**
   * Filter by location IDs.
   */
  location_id?: Array<string>
  /**
   * Filter by the inventory ID
   */
  id?: string | Array<string>
  /**
   * Filter by SKU
   */
  sku?: string
  /**
   * Filter by origin country
   */
  origin_country?: string
  /**
   * Filter by MID code
   */
  mid_code?: string
  /**
   * Filter by material
   */
  material?: string
  /**
   * Filter by HS Code
   */
  hs_code?: string
  /**
   * Filter by weight
   */
  weight?: string
  /**
   * Filter by length
   */
  length?: string
  /**
   * Filter by height
   */
  height?: string
  /**
   * Filter by width
   */
  width?: string
  /**
   * Filter by whether the item requires shipping
   */
  requires_shipping?: string
}
