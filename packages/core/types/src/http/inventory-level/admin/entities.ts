export interface InventoryLevel {
  id: string
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity: number
  available_quantity: number
  incoming_quantity: number
  metadata?: Record<string, unknown> | null
}
