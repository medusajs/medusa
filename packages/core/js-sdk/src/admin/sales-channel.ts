import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class SalesChannel {
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

  /**
   * This method creates a new sales channel. It sends a request to the
   * [Create Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannels)
   * API route.
   * 
   * @param body - The details of the sales channel to create.
   * @param query - Configure the fields and relations to retrieve in the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   * 
   * @example
   * sdk.admin.salesChannel.create({
   *   name: "Storefront",
   * })
   * .then(({ salesChannel }) => {
   *   console.log(salesChannel)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateSalesChannel,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a sales channel. It sends a request to the
   * [Update Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsid)
   * API route.
   * 
   * @param id - The ID of the sales channel to update.
   * @param body - The details of the sales channel to update.
   * @param query - Configure the fields and relations to retrieve in the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   * 
   * @example
   * sdk.admin.salesChannel.update(
   *   "sc_123",
   *   {
   *     name: "Storefront",
   *   }
   * )
   * .then(({ salesChannel }) => {
   *   console.log(salesChannel)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateSalesChannel,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a sales channel. It sends a request to the
   * [Delete Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_deletesaleschannelsid)
   * API route.
   * 
   * @param id - The ID of the sales channel to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.salesChannel.delete("sc_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelDeleteResponse>(
      `/admin/sales-channels/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a sales channel. It sends a request to the
   * [Retrieve Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_getsaleschannelsid)
   * API route.
   * 
   * @param id - The ID of the sales channel to retrieve.
   * @param query - Configure the fields and relations to retrieve in the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   * 
   * @example
   * To retrieve a sales channel by its ID:
   * 
   * ```ts
   * sdk.admin.salesChannel.retrieve("sc_123")
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.salesChannel.retrieve("sc_123", {
   *   fields: "id,*products"
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a list of sales channels. It sends a request to the
   * [List Sales Channels](https://docs.medusajs.com/api/admin#sales-channels_getsaleschannels)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of sales channels.
   * 
   * @example
   * To retrieve the list of sales channels:
   * 
   * ```ts
   * sdk.admin.salesChannel.list()
   * .then(({ sales_channels, count, limit, offset }) => {
   *   console.log(sales_channels)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.salesChannel.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ sales_channels, count, limit, offset }) => {
   *   console.log(sales_channels)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each sales channel:
   * 
   * ```ts
   * sdk.admin.salesChannel.list({
   *   fields: "id,*products"
   * })
   * .then(({ sales_channels, count, limit, offset }) => {
   *   console.log(sales_channels)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminSalesChannelListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelListResponse>(
      `/admin/sales-channels`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method manages the products in a sales channel to add or remove them. It sends a request to the
   * [Manage Products in Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsidproducts)
   * API route.
   * 
   * @param id - The ID of the sales channel to manage the products for.
   * @param body - The details of the products to add or remove from the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   * 
   * @example
   * sdk.admin.salesChannel.updateProducts("sc_123", {
   *   add: ["prod_123", "prod_456"],
   *   remove: ["prod_789"]
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   * 
   * @deprecated Use {@link batchProducts} instead
   */
  async updateProducts(
    id: string,
    body: HttpTypes.AdminUpdateSalesChannelProducts,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels/${id}/products`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method manages the products in a sales channel to add or remove them. It sends a request to the
   * [Manage Products in Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsidproducts)
   * API route.
   * 
   * @param id - The ID of the sales channel to manage the products for.
   * @param body - The details of the products to add or remove from the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   * 
   * @example
   * sdk.admin.salesChannel.batchProducts("sc_123", {
   *   add: ["prod_123", "prod_456"],
   *   remove: ["prod_789"]
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   */
  async batchProducts(
    id: string,
    body: HttpTypes.AdminUpdateSalesChannelProducts,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels/${id}/products`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
