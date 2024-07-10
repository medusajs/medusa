import {
  DeleteResponse,
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Customer {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateCustomer,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<{
      customer: HttpTypes.AdminCustomer
    }>(`/admin/customers`, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateCustomer,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<{ customer: HttpTypes.AdminCustomer }>(
      `/admin/customers/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    queryParams?: FindParams & HttpTypes.AdminCustomerFilters,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<
      PaginatedResponse<{ customers: HttpTypes.AdminCustomer[] }>
    >(`/admin/customers`, {
      headers,
      query: queryParams,
    })
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return this.client.fetch<{ customer: HttpTypes.AdminCustomer }>(
      `/admin/customers/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<DeleteResponse<"customer">>(
      `/admin/customers/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
