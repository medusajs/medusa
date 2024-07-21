import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class User {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateUser,
    query?: HttpTypes.AdminUserParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminUserResponse>(`/admin/users`, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateUser,
    query?: HttpTypes.AdminUserParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminUserResponse>(
      `/admin/users/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    queryParams?: HttpTypes.AdminUserListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminUserListResponse>(`/admin/users`, {
      headers,
      query: queryParams,
    })
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminUserParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminUserResponse>(
      `/admin/users/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminUserDeleteResponse>(
      `/admin/users/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async me(query?: HttpTypes.AdminUserParams, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminUserResponse>(`/admin/users/me`, {
      query,
      headers,
    })
  }
}
