import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class StockLocation {
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
   * This method creates a new stock location. It sends a request to the
   * [Create Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocations)
   * API route.
   * 
   * @param body - The details of the stock location to create.
   * @param query - Configure the fields and relations to retrieve in the stock location.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   * 
   * @example
   * sdk.admin.stockLocation.create({
   *   name: "Main Warehouse",
   *   address_id: "addr_123",
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateStockLocation,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a stock location. It sends a request to the
   * [Update Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsid)
   * API route.
   * 
   * @param id - The ID of the stock location to update.
   * @param body - The details of the stock location to update.
   * @param query - Configure the fields and relations to retrieve in the stock location.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   * 
   * @example
   * sdk.admin.stockLocation.update("sloc_123", {
   *   name: "European Warehouse",
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateStockLocation,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a stock location. It sends a request to the
   * [Delete Stock Location](https://docs.medusajs.com/api/admin#stock-locations_deletestocklocationsid)
   * API route.
   * 
   * @param id - The ID of the stock location to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.stockLocation.delete("sloc_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminStockLocationDeleteResponse>(
      `/admin/stock-locations/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a stock location. It sends a request to the
   * [Get Stock Location](https://docs.medusajs.com/api/admin#stock-locations_getstocklocationsid)
   * API route.
   * 
   * @param id - The ID of the stock location to retrieve.
   * @param query - Configure the fields and relations to retrieve in the stock location.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   * 
   * @example
   * To retrieve a stock location by its ID:
   * 
   * ```ts
   * sdk.admin.stockLocation.retrieve("sloc_123")
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.stockLocation.retrieve("sloc_123", {
   *   fields: "id,*sales_channels"
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a list of stock locations. It sends a request to the
   * [List Stock Locations](https://docs.medusajs.com/api/admin#stock-locations_getstocklocations)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of stock locations.
   * 
   * @example
   * To retrieve the list of stock locations:
   * 
   * ```ts
   * sdk.admin.stockLocation.list()
   * .then(({ stock_locations, count, limit, offset }) => {
   *   console.log(stock_locations)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.stockLocation.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ stock_locations, count, limit, offset }) => {
   *   console.log(stock_locations)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each stock location:
   * 
   * ```ts
   * sdk.admin.stockLocation.list({
   *   fields: "id,*sales_channels"
   * })
   * .then(({ stock_locations, count, limit, offset }) => {
   *   console.log(stock_locations)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminStockLocationListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationListResponse>(
      `/admin/stock-locations`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method manages the sales channels of a stock location by adding or removing them. It sends a request to the
   * [Manage Stock Location Sales Channels](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidsaleschannels)
   * API route.
   * 
   * @param id - The ID of the stock location to update the sales channels for.
   * @param body - The details of the sales channels to update.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   * 
   * @example
   * sdk.admin.stockLocation.updateSalesChannels("sloc_123", {
   *   add: ["sc_123"],
   *   remove: ["sc_456"],
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  async updateSalesChannels(
    id: string,
    body: HttpTypes.AdminUpdateStockLocationSalesChannels,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}/sales-channels`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method adds a new fulfillment set to a stock location. It sends a request to the
   * [Add Fulfillment Set to Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidfulfillmentsets)
   * API route.
   * 
   * @param id - The ID of the stock location to add the fulfillment set to.
   * @param body - The details of the fulfillment set to add.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   * 
   * @example
   * sdk.admin.stockLocation.createFulfillmentSet("sloc_123", {
   *   name: "Shipping",
   *   type: "shipping",
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  async createFulfillmentSet(
    id: string,
    body: HttpTypes.AdminCreateStockLocationFulfillmentSet,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}/fulfillment-sets`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method manages the fulfillment providers of a stock location by adding or removing them. It sends a request to the
   * [Manage Fulfillment Providers of Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidfulfillmentproviders)
   * API route.
   * 
   * @param id - The ID of the stock location to manage the fulfillment providers for.
   * @param body - The details of the fulfillment providers to manage.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   * 
   * @example
   * sdk.admin.stockLocation.updateFulfillmentProviders("sloc_123", {
   *   add: ["fp_manual_manual"],
   *   remove: ["fp_shipstation_shipstation"],
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  async updateFulfillmentProviders(
    id: string,
    body: HttpTypes.AdminBatchLink,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}/fulfillment-providers`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
