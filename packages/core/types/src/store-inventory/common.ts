import { BaseFilterable } from "../dal"

export type StoreMode = "normal" | "discount"

/**
 * The store inventory details.
 */
export interface StoreInventoryDTO {
  /**
   * The ID of the store inventory.
   */
  id: string

  /**
   * The location ID.
   */
  location_id: string

  /**
   * The material ID.
   */
  material_id: string

  /**
   * The online stock quantity.
   */
  online_stock?: number

  /**
   * The online reserved quantity.
   */
  online_reserved?: number

  /**
   * The share stock quantity.
   */
  share_stock?: number

  /**
   * The share reserved quantity.
   */
  share_reserved?: number

  /**
   * The in-transit stock quantity.
   */
  in_transit_stock?: number

  /**
   * The store mode.
   */
  store_mode?: StoreMode

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the store inventory.
   */
  created_at: string

  /**
   * The updated at of the store inventory.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved store inventories.
 */
export interface FilterableStoreInventoryProps
  extends BaseFilterable<FilterableStoreInventoryProps> {
  /**
   * The IDs to filter the store inventories by.
   */
  id?: string | string[]

  /**
   * Filter store inventories by their location IDs.
   */
  location_id?: string | string[]

  /**
   * Filter store inventories by their material IDs.
   */
  material_id?: string | string[]

  /**
   * Filter store inventories by their store modes.
   */
  store_mode?: StoreMode | StoreMode[]
}
