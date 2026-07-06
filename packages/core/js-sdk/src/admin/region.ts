import {
  FindParams,
  HttpTypes,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Region {
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
   * This method creates a new region. It sends a request to the 
   * [Create Region](https://docs.medusajs.com/api/admin#regions_postregions)
   * API route.
   * 
   * @param body - The details of the region to create.
   * @param query - Configure the fields and relations to retrieve in the region.
   * @param headers - Headers to pass in the request.
   * @returns The created region's details.
   * 
   * @example
   * sdk.admin.region.create({
   *   name: "United States",
   *   currency_code: "usd",
   * })
   * .then(({ region }) => {
   *   console.log(region)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateRegion,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRegionResponse>(
      `/admin/regions`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a region. It sends a request to the 
   * [Update Region](https://docs.medusajs.com/api/admin#regions_postregionsid)
   * API route.
   * 
   * @param id - The ID of the region to update.
   * @param body - The details of the region to update.
   * @param query - Configure the fields and relations to retrieve in the region.
   * @param headers - Headers to pass in the request.
   * @returns The updated region's details.
   * 
   * @example
   * sdk.admin.region.update("region_123", {
   *   name: "United States",
   * })
   * .then(({ region }) => {
   *   console.log(region)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateRegion,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRegionResponse>(
      `/admin/regions/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a list of regions. It sends a request to the 
   * [List Regions](https://docs.medusajs.com/api/admin#regions_getregions)
   * API route.
   * 
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of regions.
   * 
   * @example
   * To retrieve the list of regions:
   * 
   * ```ts
   * sdk.admin.region.list()
   * .then(({ regions, count, limit, offset }) => {
   *   console.log(regions)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.region.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ regions, count, limit, offset }) => {
   *   console.log(regions)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each region:
   * 
   * ```ts
   * sdk.admin.region.list({
   *   fields: "id,*countries"
   * })
   * .then(({ regions, count, limit, offset }) => {
   *   console.log(regions)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    queryParams?: FindParams & HttpTypes.AdminRegionFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRegionListResponse>(
      `/admin/regions`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  /**
   * This method retrieves a region by ID. It sends a request to the 
   * [Get Region](https://docs.medusajs.com/api/admin#regions_getregionsid)
   * API route.
   * 
   * @param id - The ID of the region to retrieve.
   * @param query - Configure the fields and relations to retrieve in the region.
   * @param headers - Headers to pass in the request.
   * @returns The region's details.
   * 
   * @example
   * To retrieve a region by its ID:
   * 
   * ```ts
   * sdk.admin.region.retrieve("region_123")
   * .then(({ region }) => {
   *   console.log(region)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.region.retrieve("region_123", {
   *   fields: "id,*countries"
   * })
   * .then(({ region }) => {
   *   console.log(region)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminRegionResponse>(
      `/admin/regions/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a region by ID. It sends a request to the 
   * [Delete Region](https://docs.medusajs.com/api/admin#regions_deleteregionsid)
   * API route.
   * 
   * @param id - The ID of the region to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.region.delete("region_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminRegionDeleteResponse>(
      `/admin/regions/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
