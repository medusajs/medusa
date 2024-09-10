export interface AdminInventoryItem {
  id: string
  sku?: string | null
  origin_country?: string | null
  hs_code?: string | null
  requires_shipping: boolean
  mid_code?: string | null
  material?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  title?: string | null
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null

  location_levels?: AdminInventoryLevel[]
}

export interface AdminInventoryLevel {
  id: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  inventory_item_id: string
  location_id: string
  stocked_quantity: number
  reserved_quantity: number
  incoming_quantity: number
  metadata: Record<string, unknown> | null
  inventory_item?: AdminInventoryItem
  available_quantity: number | null
}
