import { PaginatedResponse } from "../../common"
import { AdminInventoryItem } from "./entities"

export interface AdminInventoryItemResponse {
  inventory_item: AdminInventoryItem
}

export type AdminInventoryItemListResponse = PaginatedResponse<{
  inventory_items: AdminInventoryItem[]
}>
