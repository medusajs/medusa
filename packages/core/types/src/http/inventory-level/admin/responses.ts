import { PaginatedResponse } from "../../common"
import { InventoryLevel } from "./entities"

export interface AdminInventoryLevelResponse {
  inventory_level: InventoryLevel
}

export type AdminInventoryLevelListResponse = PaginatedResponse<{
  inventory_levels: InventoryLevel[]
}>
