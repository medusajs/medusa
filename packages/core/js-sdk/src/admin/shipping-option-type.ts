import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class ShippingOptionType {
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
   * This method creates a shipping option type. It sends a request to the
   * [Create Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_postshippingoptiontypes)
   * API route.
   *
   * @param body - The shipping option type's details.
   * @param query - Configure the fields to retrieve in the shipping option type.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * sdk.admin.shippingOptionType.create({
   *   label: "Standard",
   *   code: "standard",
   *   description: "Ship in 2-3 days."
   * })
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateShippingOptionType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminShippingOptionTypeResponse>(
      `/admin/shipping-option-types`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a shipping option type. It sends a request to the
   * [Update Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_postshippingoptiontypesid)
   * API route.
   *
   * @param id - The shipping option type's ID.
   * @param body - The data to update in the shipping option type.
   * @param query - Configure the fields to retrieve in the shipping option type.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * sdk.admin.shippingOptionType.update("sotype_123", {
   *   code: "express"
   * })
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateShippingOptionType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminShippingOptionTypeResponse>(
      `/admin/shipping-option-types/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of shipping option types. It sends a request to the
   * [List Shipping Option Types](https://docs.medusajs.com/api/admin#shipping-option-types_getshippingoptiontypes) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of shipping option types.
   *
   * @example
   * To retrieve the list of shipping option types:
   *
   * ```ts
   * sdk.admin.shippingOptionType.list()
   * .then(({ shipping_option_types, count, limit, offset }) => {
   *   console.log(shipping_option_types)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.shippingOptionType.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ shipping_option_types, count, limit, offset }) => {
   *   console.log(shipping_option_types)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each shipping option type:
   *
   * ```ts
   * sdk.admin.shippingOptionType.list({
   *   fields: "id,*shippingOptions"
   * })
   * .then(({ shipping_option_types, count, limit, offset }) => {
   *   console.log(shipping_option_types)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminShippingOptionTypeListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminShippingOptionTypeListResponse>(
      `/admin/shipping-option-types`,
      {
        headers,
        query: query,
      }
    )
  }

  /**
   * This method retrieves a shipping option type by its ID. It sends a request to the
   * [Get Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_getshippingoptiontypesid)
   * API route.
   *
   * @param id - The shipping option type's ID.
   * @param query - Configure the fields to retrieve in the shipping option type.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * To retrieve a shipping option type by its ID:
   *
   * ```ts
   * sdk.admin.shippingOptionType.retrieve("sotype_123")
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.shippingOptionType.retrieve("sotype_123", {
   *   fields: "id,*shippingOptions"
   * })
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminShippingOptionTypeResponse>(
      `/admin/shipping-option-types/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a shipping option type. It sends a request to the
   * [Delete Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_deleteshippingoptiontypesid)
   * API route.
   *
   * @param id - The shipping option type's ID.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * sdk.admin.shippingOptionType.delete("sotype_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminShippingOptionTypeDeleteResponse>(
      `/admin/shipping-option-types/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
