import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Store {
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
   * This method retrieves a store by its ID. It sends a request to the
   * [Get Store](https://docs.medusajs.com/api/admin#stores_getstoresid)
   * API route.
   * 
   * @param id - The ID of the store to retrieve.
   * @param query - Configure the fields and relations to retrieve in the store.
   * @param headers - Headers to pass in the request.
   * @returns The store's details.
   * 
   * @example
   * To retrieve a store by its ID:
   * 
   * ```ts
   * sdk.admin.store.retrieve("store_123")
   * .then(({ store }) => {
   *   console.log(store)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.store.retrieve("store_123", {
   *   fields: "id,*supported_currencies"
   * })
   * .then(({ store }) => {
   *   console.log(store)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminStoreParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStoreResponse>(
      `/admin/stores/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a list of stores. It sends a request to the
   * [List Stores](https://docs.medusajs.com/api/admin#stores_getstores)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of stores.
   * 
   * @example
   * To retrieve the list of stores:
   * 
   * ```ts
   * sdk.admin.store.list()
   * .then(({ stores, count, limit, offset }) => {
   *   console.log(stores)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.store.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ stores, count, limit, offset }) => {
   *   console.log(stores)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each store:
   * 
   * ```ts
   * sdk.admin.store.list({
   *   fields: "id,*supported_currencies"
   * })
   * .then(({ stores, count, limit, offset }) => {
   *   console.log(stores)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(query?: HttpTypes.AdminStoreListParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminStoreListResponse>(
      `/admin/stores`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method updates a store. It sends a request to the
   * [Update Store](https://docs.medusajs.com/api/admin#stores_poststoresid)
   * API route.
   * 
   * @param id - The ID of the store to update.
   * @param body - The details of the store to update.
   * @param query - Configure the fields and relations to retrieve in the store.
   * @param headers - Headers to pass in the request.
   * @returns The store's details.
   * 
   * @example
   * sdk.admin.store.update("store_123", {
   *   name: "My Store",
   * })
   * .then(({ store }) => {
   *   console.log(store)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateStore,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStoreResponse>(
      `/admin/stores/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
