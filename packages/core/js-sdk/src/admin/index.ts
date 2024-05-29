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
      return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
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
      return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
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
      return await this.client.fetch<
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
      return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
        `/admin/regions/${id}`,
        {
          query,
          headers,
        }
      )
    },
    delete: async (id: string, headers?: ClientHeaders) => {
      return await this.client.fetch<DeleteResponse<"region">>(
        `/admin/regions/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }

  public invites = {
    accept: async (
      input: HttpTypes.AdminAcceptInvite & { invite_token: string },
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
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
    },
    create: async (
      body: HttpTypes.AdminCreateInvite,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<{ invite: HttpTypes.AdminInviteResponse }>(
        `/admin/invites`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<{ invite: HttpTypes.AdminInviteResponse }>(
        `/admin/invites/${id}`,
        {
          headers,
          query,
        }
      )
    },
    list: async (queryParams?: FindParams, headers?: ClientHeaders) => {
      return await this.client.fetch<
        PaginatedResponse<{ invites: HttpTypes.AdminInviteResponse[] }>
      >(`/admin/invites`, {
        headers,
        query: queryParams,
      })
    },
    resend: async (id: string, headers?: ClientHeaders) => {
      return await this.client.fetch<{ invite: HttpTypes.AdminInviteResponse }>(
        `/admin/invites/${id}/resend`,
        {
          headers,
        }
      )
    },
    delete: async (id: string, headers?: ClientHeaders) => {
      return await this.client.fetch<DeleteResponse<"invite">>(
        `/admin/invites/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }

  public products = {
    create: async (
      body: HttpTypes.AdminCreateProduct,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<{ product: HttpTypes.AdminProduct }>(
        `/admin/products`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
  }

  public customer = {
    create: async (
      body: HttpTypes.AdminCreateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{
        customer: HttpTypes.AdminCustomer
        token: string
      }>(`/admin/customers`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
    update: async (
      id: string,
      body: HttpTypes.AdminUpdateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ customer: HttpTypes.AdminCustomer }>(
        `/admin/customers/${id}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    list: async (
      queryParams?: FindParams & HttpTypes.AdminCollectionFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ customers: HttpTypes.AdminCustomer[] }>
      >(`/admin/customers`, {
        headers,
        query: queryParams,
      })
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ customer: HttpTypes.AdminCustomer }>(
        `/admin/customers/${id}`,
        {
          query,
          headers,
        }
      )
    },
    delete: async (id: string, headers?: ClientHeaders) => {
      return this.client.fetch<DeleteResponse<"customer">>(
        `/admin/customers/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }

  public collection = {
    create: async (
      body: HttpTypes.AdminCreateCollection,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
        `/admin/collections`,
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
      body: HttpTypes.AdminUpdateCollection,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
        `/admin/collections/${id}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    list: async (queryParams?: FindParams, headers?: ClientHeaders) => {
      return this.client.fetch<
        PaginatedResponse<{ collections: HttpTypes.AdminCollection[] }>
      >(`/admin/collections`, {
        headers,
        query: queryParams,
      })
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
        `/admin/collections/${id}`,
        {
          query,
          headers,
        }
      )
    },
    delete: async (id: string, headers?: ClientHeaders) => {
      return this.client.fetch<DeleteResponse<"collection">>(
        `/admin/collections/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
    updateProducts: async (
      id: string,
      body: HttpTypes.AdminUpdateCollectionProducts,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
        `/admin/collections/${id}/products`,
        {
          method: "POST",
          headers,
          body,
        }
      )
    },
  }
}
