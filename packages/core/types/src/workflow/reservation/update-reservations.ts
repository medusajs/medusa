import { ReservationItemDTO, UpdateReservationItemInput } from "../../inventory"

export interface UpdateReservationsWorkflowInput {
  updates: UpdateReservationItemInput[]
}

export type UpdateReservationsWorkflowOutput = ReservationItemDTO[]
