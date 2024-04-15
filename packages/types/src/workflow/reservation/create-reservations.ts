import { InventoryNext } from "../../inventory"

export interface CreateReservationsWorkflowInput {
  reservations: InventoryNext.CreateReservationItemInput[]
}

export type CreateReservationsWorkflowOutput =
  InventoryNext.ReservationItemDTO[]
