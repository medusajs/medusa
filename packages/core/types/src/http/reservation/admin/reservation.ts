import { PaginatedResponse } from "../../../common"

/**
 * @experimental
 */
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

/**
 * @experimental
 */
export interface AdminReservationResponse {
  reservation: ReservationResponse
}

/**
 * @experimental
 */
export interface AdminReservationListResponse extends PaginatedResponse {
  reservations: ReservationResponse[]
}
