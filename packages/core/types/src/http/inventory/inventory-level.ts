import { AdminInventoryItemResponse } from "./inventory"
import { PaginatedResponse } from "../common"

interface InventoryLevelResponse {
  id: string
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity: number
  available_quantity: number
  incoming_quantity: number
  metadata?: Record<string, unknown> | null
}

export interface AdminInventoryLevelResponse {
  inventory_item: AdminInventoryItemResponse
}

export type AdminInventoryLevelListResponse = PaginatedResponse<{
  inventory_levels: InventoryLevelResponse[]
}>
