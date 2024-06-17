import { PaginatedResponse } from "../../common"

interface ReservationResponse {
  id: string
  line_item_id: string | null
  location_id: string
  quantity: string
  external_id: string | null
  description: string | null
  inventory_item_id: string
  inventory_item: Record<string, unknown> // TODO: add InventoryItemResponse
  metadata?: Record<string, unknown>
  created_by?: string | null
  deleted_at?: Date | string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export interface AdminReservationResponse {
  reservation: ReservationResponse
}

export type AdminReservationListResponse = PaginatedResponse<{
  reservations: ReservationResponse[]
}>
