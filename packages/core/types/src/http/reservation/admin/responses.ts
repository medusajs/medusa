import { PaginatedResponse } from "../../common"
import { ReservationResponse } from "./entities"

export interface AdminReservationResponse {
  reservation: ReservationResponse
}

export type AdminReservationListResponse = PaginatedResponse<{
  reservations: ReservationResponse[]
}>
