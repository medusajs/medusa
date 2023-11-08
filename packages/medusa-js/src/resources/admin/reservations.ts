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

/**
 * This class is used to send requests to [Admin Reservation API Routes](https://docs.medusajs.com/api/admin#reservations). To use these API Routes, make sure to install the
 * [@medusajs/inventory](https://docs.medusajs.com/modules/multiwarehouse/install-modules#inventory-module) module in your Medusa backend.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}. The methods
 * are available in the JS Client under the `medusa.admin.reservations` property.
 * 
 * Reservations, provided by the [Inventory Module](https://docs.medusajs.com/modules/multiwarehouse/inventory-module), are quantities of an item that are reserved, typically when an order is placed but not yet fulfilled.
 * Reservations can be associated with any resources, but commonly with line items of an order.
 * 
 * Related Guide: [How to manage item allocations in orders](https://docs.medusajs.com/modules/multiwarehouse/admin/manage-item-allocations-in-orders).
 */
class AdminReservationsResource extends BaseResource {
  /**
   * Retrieve a reservation's details.
   * @param {string} id - The reservation's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReservationsRes>} Resolves to the reservation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.reservations.retrieve(reservationId)
   * .then(({ reservation }) => {
   *   console.log(reservation.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, unknown> = {}
  ): ResponsePromise<AdminReservationsRes> {
    const path = `/admin/reservations/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of reservations. The reservations can be filtered by fields such as `location_id` or `quantity` passed in the `query` parameter. The reservations can also be paginated.
   * @param {AdminGetReservationsParams} query - Filters and pagination parameters to apply on the retrieved reservations.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReservationsListRes>} Resolves to the list of reservations with pagination fields.
   * 
   * @example
   * To list reservations:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.reservations.list()
   * .then(({ reservations, count, limit, offset }) => {
   *   console.log(reservations.length)
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the reservations:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.reservations.list({
   *   expand: "location"
   * })
   * .then(({ reservations, count, limit, offset }) => {
   *   console.log(reservations.length)
   * })
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.reservations.list({
   *   expand: "location",
   *   limit,
   *   offset
   * })
   * .then(({ reservations, count, limit, offset }) => {
   *   console.log(reservations.length)
   * })
   * ```
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
   * Create a reservation which can be associated with any resource, such as an order's line item.
   * @param {AdminPostReservationsReq} payload - The reservation to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReservationsRes>} Resolves to the reservation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.reservations.create({
   *   line_item_id: "item_123",
   *   location_id: "loc_123",
   *   inventory_item_id: "iitem_123",
   *   quantity: 1
   * })
   * .then(({ reservation }) => {
   *   console.log(reservation.id);
   * });
   */
  create(
    payload: AdminPostReservationsReq,
    customHeaders: Record<string, unknown> = {}
  ): ResponsePromise<AdminReservationsRes> {
    const path = `/admin/reservations`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a reservation's details.
   * @param {string} id - The ID of the reservation.
   * @param {AdminPostReservationsReservationReq} payload - The attributes to update in the reservation.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReservationsRes>} Resolves to the reservation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.reservations.update(reservationId, {
   *   quantity: 3
   * })
   * .then(({ reservation }) => {
   *   console.log(reservation.id);
   * });
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
   * Delete a reservation. Associated resources, such as the line item, will not be deleted.
   * @param {string} id - The ID of the reservation. 
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReservationsDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.reservations.delete(reservationId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * });
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
