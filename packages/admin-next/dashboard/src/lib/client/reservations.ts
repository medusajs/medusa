import { CreateRegionDTO, UpdateRegionDTO } from "@medusajs/types"
import {
  ReservationDeleteRes,
  ReservationListRes,
  ReservationRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveReservation(id: string, query?: Record<string, any>) {
  console.warn("getting reservation")
  return getRequest<ReservationRes>(`/admin/reservations/${id}`, query)
}

async function listReservations(query?: Record<string, any>) {
  return getRequest<ReservationListRes>(`/admin/reservations`, query)
}

async function createReservation(payload: CreateRegionDTO) {
  return postRequest<ReservationRes>(`/admin/reservations`, payload)
}

async function updateReservation(id: string, payload: UpdateRegionDTO) {
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
