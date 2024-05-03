import { InventoryNext } from "../../inventory"

export interface UpdateReservationsWorkflowInput {
  updates: InventoryNext.UpdateReservationItemInput[]
}

export type UpdateReservationsWorkflowOutput =
  InventoryNext.ReservationItemDTO[]
