export interface AdminCreateReservation {
  line_item_id?: string | null
  location_id: string
  inventory_item_id: string
  quantity: number
  description?: string | null
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateReservation {
  location_id?: string
  quantity?: number
  description?: string | null
  metadata?: Record<string, unknown> | null
}
