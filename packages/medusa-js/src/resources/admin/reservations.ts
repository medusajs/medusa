import {
  AdminPostReservationsReq,
  AdminPostReservationsReservationReq,
  AdminReservationsDeleteRes,
  AdminReservationsRes,
  AdminGetReservationsParams,
  AdminReservationsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminReservationsResource extends BaseResource {
  /**
   * Get a reservation
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description gets a reservation
   * @returns The reservation with the provided id
   */
  retrieve(
    id: string,
    customHeaders: Record<string, unknown> = {}
  ): ResponsePromise<AdminReservationsRes> {
    const path = `/admin/reservations/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * List reservations
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description Lists reservations
   * @returns A list of reservations matching the provided query
   */
  list(
    query?: AdminGetReservationsParams,
    customHeaders: Record<string, unknown> = {}
  ): ResponsePromise<AdminReservationsListRes> {
    let path = `/admin/reservations`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * create a reservation
   * @description create a reservation
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @returns the created reservation
   */
  create(
    payload: AdminPostReservationsReq,
    customHeaders: Record<string, unknown> = {}
  ): ResponsePromise<AdminReservationsRes> {
    const path = `/admin/reservations`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * update a reservation
   * @description update a reservation
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @returns The updated reservation
   */
  update(
    id: string,
    payload: AdminPostReservationsReservationReq,
    customHeaders: Record<string, unknown> = {}
  ): ResponsePromise<AdminReservationsRes> {
    const path = `/admin/reservations/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * remove a reservation
   * @description remove a reservation
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @returns reservation removal confirmation
   */
  delete(
    id: string,
    customHeaders: Record<string, unknown> = {}
  ): ResponsePromise<AdminReservationsDeleteRes> {
    const path = `/admin/reservations/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminReservationsResource
