import {
  DeleteResponse,
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Admin {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  public region = {
    create: async (
      body: HttpTypes.AdminCreateRegion,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ region: HttpTypes.AdminRegion }>(
        `/admin/regions`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    update: async (
      id: string,
      body: HttpTypes.AdminUpdateRegion,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ region: HttpTypes.AdminRegion }>(
        `/admin/regions/${id}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    list: async (
      queryParams?: FindParams & HttpTypes.AdminRegionFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>
      >(`/admin/regions`, {
        query: queryParams,
        headers,
      })
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ region: HttpTypes.AdminRegion }>(
        `/admin/regions/${id}`,
        {
          query,
          headers,
        }
      )
    },
    delete: async (id: string, headers?: ClientHeaders) => {
      return this.client.fetch<DeleteResponse<"region">>(
        `/admin/regions/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }
}
