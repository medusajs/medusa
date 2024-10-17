import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

class Reservation {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminReservationParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReservationResponse>(
      `/admin/reservations/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminGetReservationsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReservationListResponse>(
      "/admin/reservations",
      {
        method: "GET",
        query,
        headers,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreateReservation,
    query?: HttpTypes.AdminGetReservationsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReservationResponse>(
      "/admin/reservations",
      {
        method: "POST",
        body,
        query,
        headers,
      }
    )
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateReservation,
    query?: HttpTypes.AdminGetReservationsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReservationResponse>(
      `/admin/reservations/${id}`,
      {
        method: "POST",
        body,
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminReservationDeleteResponse>(
      `/admin/reservations/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}

export default Reservation
