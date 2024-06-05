import {
  DeleteResponse,
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Invite {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async accept(
    input: HttpTypes.AdminAcceptInvite & { invite_token: string },
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    const { invite_token, ...rest } = input
    return await this.client.fetch<{ user: HttpTypes.AdminUserResponse }>(
      `/admin/invites/accept?token=${input.invite_token}`,
      {
        method: "POST",
        headers,
        body: rest,
        query,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreateInvite,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ invite: HttpTypes.AdminInviteResponse }>(
      `/admin/invites`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<{ invite: HttpTypes.AdminInviteResponse }>(
      `/admin/invites/${id}`,
      {
        headers,
        query,
      }
    )
  }

  async list(queryParams?: FindParams, headers?: ClientHeaders) {
    return await this.client.fetch<
      PaginatedResponse<{ invites: HttpTypes.AdminInviteResponse[] }>
    >(`/admin/invites`, {
      headers,
      query: queryParams,
    })
  }

  async resend(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<{ invite: HttpTypes.AdminInviteResponse }>(
      `/admin/invites/${id}/resend`,
      {
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<DeleteResponse<"invite">>(
      `/admin/invites/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
