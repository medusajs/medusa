import {
  DeleteResponse,
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Region {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateRegion,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
      `/admin/regions`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateRegion,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
      `/admin/regions/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    queryParams?: FindParams & HttpTypes.AdminRegionFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>
    >(`/admin/regions`, {
      query: queryParams,
      headers,
    })
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
      `/admin/regions/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<DeleteResponse<"region">>(
      `/admin/regions/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
