import { PaginatedResponse } from "../../common"
import { InventoryLevel } from "./entities"

export interface AdminInventoryLevelResponse {
  /**
   * The inventory level's details.
   */
  inventory_level: InventoryLevel
}

export type AdminInventoryLevelListResponse = PaginatedResponse<{
  /**
   * The list of inventory levels.
   */
  inventory_levels: InventoryLevel[]
}>
