import {
  DeleteResponse,
  DeleteResponseWithParent,
  PaginatedResponse,
} from "../../common"
import { AdminInventoryItem, AdminInventoryLevel } from "./entities"

export interface AdminInventoryItemResponse {
  /**
   * The inventory item's details.
   */
  inventory_item: AdminInventoryItem
}

export type AdminInventoryItemListResponse = PaginatedResponse<{
  /**
   * The list of inventory items.
   */
  inventory_items: AdminInventoryItem[]
}>

export type AdminInventoryItemDeleteResponse = DeleteResponse<"inventory_item">

export type AdminInventoryLevelDeleteResponse = DeleteResponseWithParent<
  "inventory-level",
  AdminInventoryItem
>

export interface AdminInventoryLevelResponse {
  /**
   * The inventory level's details.
   */
  inventory_level: AdminInventoryLevel
}

export type AdminInventoryLevelListResponse = PaginatedResponse<{
  /**
   * The list of inventory levels.
   */
  inventory_levels: AdminInventoryLevel[]
}>

/**
 * The result of creating, updating or deleting inventory levels.
 */
export interface AdminBatchInventoryItemLocationLevelsResponse {
  /**
   * The created inventory levels.
   */
  created?: AdminInventoryLevel[]
  /**
   * The updated inventory levels.
   */
  updated?: AdminInventoryLevel[]
  /**
   * The IDs of the deleted inventory levels.
   */
  deleted?: string[]
}

/**
 * The result of creating, updating or deleting inventory levels.
 */
export interface AdminBatchInventoryItemsLocationLevelsResponse
  extends AdminBatchInventoryItemLocationLevelsResponse {}
