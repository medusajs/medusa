import { CreateReservationItemInput, ReservationItemDTO } from "../../inventory"

export interface CreateReservationsWorkflowInput {
  reservations: CreateReservationItemInput[]
}

export type CreateReservationsWorkflowOutput = ReservationItemDTO[]
