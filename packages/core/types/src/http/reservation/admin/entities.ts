import { AdminInventoryItem } from "../../inventory"

export interface AdminReservation {
  id: string
  line_item_id: string | null
  location_id: string
  quantity: number
  external_id: string | null
  description: string | null
  inventory_item_id: string
  inventory_item?: AdminInventoryItem
  metadata?: Record<string, unknown>
  created_by?: string | null
  deleted_at?: Date | string | null
  created_at?: Date | string
  updated_at?: Date | string
}
