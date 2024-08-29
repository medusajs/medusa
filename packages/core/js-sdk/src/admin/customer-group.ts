import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class CustomerGroup {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminGetCustomerGroupParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCustomerGroupResponse>(
      `/admin/customer-groups/${id}`,
      {
        method: "GET",
        query,
        headers,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminGetCustomerGroupsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCustomerGroupListResponse>(
      `/admin/customer-groups`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreateCustomerGroup,
    query?: HttpTypes.AdminGetCustomerGroupsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCustomerGroupResponse>(
      `/admin/customer-groups`,
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
    body: HttpTypes.AdminUpdateCustomerGroup,
    query?: HttpTypes.AdminGetCustomerGroupsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCustomerGroupResponse>(
      `/admin/customer-groups/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.DeleteResponse<"customer_group">>(
      `/admin/customer-groups/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchCustomers(
    id: string,
    body: HttpTypes.AdminBatchLink,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCustomerGroupResponse>(
      `/admin/customer-groups/${id}/customers`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
