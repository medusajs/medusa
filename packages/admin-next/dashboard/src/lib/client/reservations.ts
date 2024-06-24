import {
  ReservationDeleteRes,
  ReservationListRes,
  ReservationRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

import { InventoryTypes } from "@medusajs/types"

async function retrieveReservation(id: string, query?: Record<string, any>) {
  return getRequest<ReservationRes>(`/admin/reservations/${id}`, query)
}

async function listReservations(query?: Record<string, any>) {
  return getRequest<ReservationListRes>(`/admin/reservations`, query)
}

async function createReservation(
  payload: InventoryTypes.CreateReservationItemInput
) {
  return postRequest<ReservationRes>(`/admin/reservations`, payload)
}

async function updateReservation(
  id: string,
  payload: InventoryTypes.UpdateReservationItemInput
) {
  return postRequest<ReservationRes>(`/admin/reservations/${id}`, payload)
}

async function deleteReservation(id: string) {
  return deleteRequest<ReservationDeleteRes>(`/admin/reservations/${id}`)
}

export const reservations = {
  retrieve: retrieveReservation,
  list: listReservations,
  create: createReservation,
  update: updateReservation,
  delete: deleteReservation,
}
