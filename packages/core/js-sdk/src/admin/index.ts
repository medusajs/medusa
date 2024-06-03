import { HttpTypes } from "@medusajs/types"
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
      query?: HttpTypes.SelectParams,
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
      query?: HttpTypes.SelectParams,
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
      queryParams?: HttpTypes.FindParams & HttpTypes.AdminRegionFilters,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<
        HttpTypes.PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>
      >(`/admin/regions`, {
        query: queryParams,
        headers,
      })
    },
    retrieve: async (
      id: string,
      query?: HttpTypes.SelectParams,
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
      return await this.client.fetch<HttpTypes.DeleteResponse<"region">>(
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
      query?: HttpTypes.SelectParams,
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
      query?: HttpTypes.SelectParams,
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
      query?: HttpTypes.SelectParams,
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
    list: async (
      queryParams?: HttpTypes.FindParams,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<
        HttpTypes.PaginatedResponse<{
          invites: HttpTypes.AdminInviteResponse[]
        }>
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
      return await this.client.fetch<HttpTypes.DeleteResponse<"invite">>(
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
      query?: HttpTypes.SelectParams,
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
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{
        customer: HttpTypes.AdminCustomer
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
      query?: HttpTypes.SelectParams,
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
      queryParams?: HttpTypes.FindParams & HttpTypes.AdminCollectionFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.PaginatedResponse<{ customers: HttpTypes.AdminCustomer[] }>
      >(`/admin/customers`, {
        headers,
        query: queryParams,
      })
    },
    retrieve: async (
      id: string,
      query?: HttpTypes.SelectParams,
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
      return this.client.fetch<HttpTypes.DeleteResponse<"customer">>(
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
      query?: HttpTypes.SelectParams,
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
      query?: HttpTypes.SelectParams,
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
    list: async (
      queryParams?: HttpTypes.FindParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.PaginatedResponse<{
          collections: HttpTypes.AdminCollection[]
        }>
      >(`/admin/collections`, {
        headers,
        query: queryParams,
      })
    },
    retrieve: async (
      id: string,
      query?: HttpTypes.SelectParams,
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
      return this.client.fetch<HttpTypes.DeleteResponse<"collection">>(
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

  public uploads = {
    // Note: The creation/upload flow be made more advanced, with support for streaming and progress, but for now we keep it simple
    create: async (
      body: HttpTypes.AdminUploadFile,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      const form = new FormData()
      if (body instanceof FileList) {
        Array.from(body).forEach((file) => {
          form.append("files", file)
        })
      } else {
        body.files.forEach((file) => {
          form.append(
            "files",
            "content" in file
              ? new Blob([file.content], {
                  type: "text/plain",
                })
              : file,
            file.name
          )
        })
      }

      return this.client.fetch<{ files: HttpTypes.AdminFile[] }>(
        `/admin/uploads`,
        {
          method: "POST",
          headers: {
            ...headers,
            // Let the browser determine the content type.
            "content-type": null,
          },
          body: form,
          query,
        }
      )
    },
    retrieve: async (
      id: string,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ file: HttpTypes.AdminFile }>(
        `/admin/uploads/${id}`,
        {
          query,
          headers,
        }
      )
    },
    delete: async (id: string, headers?: ClientHeaders) => {
      return this.client.fetch<HttpTypes.DeleteResponse<"file">>(
        `/admin/uploads/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }

  public stockLocation = {
    create: async (
      body: HttpTypes.AdminCreateStockLocation,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminStockLocationResponse>(
        `/admin/stock-locations`,
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
      body: HttpTypes.AdminUpdateStockLocation,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminStockLocationResponse>(
        `/admin/stock-locations/${id}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    list: async (
      queryParams?: HttpTypes.FindParams & HttpTypes.AdminStockLocationFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminStockLocationListResponse>(
        `/admin/stock-locations`,
        {
          headers,
          query: queryParams,
        }
      )
    },
    retrieve: async (
      id: string,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminStockLocationResponse>(
        `/admin/stock-locations/${id}`,
        {
          query,
          headers,
        }
      )
    },
    delete: async (id: string, headers?: ClientHeaders) => {
      return this.client.fetch<HttpTypes.AdminStockLocationDeleteResponse>(
        `/admin/stock-locations/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
    updateSalesChannels: async (
      id: string,
      body: HttpTypes.AdminUpdateStockLocationSalesChannels,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminStockLocationResponse>(
        `/admin/stock-locations/${id}/sales-channels`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    createFulfillmentSet: async (
      id: string,
      body: HttpTypes.AdminCreateStockLocationFulfillmentSet,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminStockLocationResponse>(
        `/admin/stock-locations/${id}/fulfillment-sets`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
  }

  public fulfillmentSet = {
    delete: async (id: string, headers?: ClientHeaders) => {
      return this.client.fetch<HttpTypes.AdminFulfillmentSetDeleteResponse>(
        `/admin/fulfillment-sets/${id}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
    retrieveServiceZone: async (
      fulfillmentSetId: string,
      serviceZoneId: string,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminServiceZoneResponse>(
        `/admin/fulfillment-sets/${fulfillmentSetId}/service-zone/${serviceZoneId}`,
        {
          query,
          headers,
        }
      )
    },
    createServiceZone: async (
      id: string,
      body: HttpTypes.AdminCreateFulfillmentSetServiceZone,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminFulfillmentSetResponse>(
        `/admin/fulfillment-sets/${id}/service-zones`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    updateServiceZone: async (
      fulfillmentSetId: string,
      serviceZoneId: string,
      body: HttpTypes.AdminUpdateFulfillmentSetServiceZone,
      query?: HttpTypes.SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminFulfillmentSetResponse>(
        `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    deleteServiceZone: async (
      fulfillmentSetId: string,
      serviceZoneId: string,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.AdminServiceZoneDeleteResponse>(
        `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }
}
