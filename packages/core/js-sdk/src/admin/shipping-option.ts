import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class ShippingOption {
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
   * This method creates a shipping option. It sends a request to the
   * [Create Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions)
   * API route.
   * 
   * @param body - The details of the shipping option to create.
   * @param query - Configure the fields and relations to retrieve in the shipping option.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   * 
   * @example
   * sdk.admin.shippingOption.create({
   *   name: "Standard Shipping",
   *   profile_id: "shp_123",
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateShippingOption,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionResponse>(
      `/admin/shipping-options`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a shipping option. It sends a request to the
   * [Get Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_getshippingoptionsid)
   * API route.
   * 
   * @param id - The ID of the shipping option to retrieve.
   * @param query - Configure the fields and relations to retrieve in the shipping option.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   * 
   * @example
   * To retrieve a shipping option by its ID:
   * 
   * ```ts
   * sdk.admin.shippingOption.retrieve("so_123")
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.shippingOption.retrieve("so_123", {
   *   fields: "id,*service_zone"
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
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
    return await this.client.fetch<HttpTypes.AdminShippingOptionResponse>(
      `/admin/shipping-options/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method updates a shipping option. It sends a request to the
   * [Update Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptionsid)
   * API route.
   * 
   * @param id - The ID of the shipping option to update.
   * @param body - The details of the shipping option to update.
   * @param query - Configure the fields and relations to retrieve in the shipping option.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   * 
   * @example
   * sdk.admin.shippingOption.update("so_123", {
   *   name: "Standard Shipping",
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateShippingOption,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionResponse>(
      `/admin/shipping-options/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a shipping option. It sends a request to the
   * [Delete Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_deleteshippingoptionsid)
   * API route.
   * 
   * @param id - The ID of the shipping option to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.shippingOption.delete("so_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionDeleteResponse>(
      `/admin/shipping-options/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a list of shipping options. It sends a request to the
   * [List Shipping Options](https://docs.medusajs.com/api/admin#shipping-options_getshippingoptions)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of shipping options.
   * 
   * @example
   * To retrieve the list of shipping options:
   * 
   * ```ts
   * sdk.admin.shippingOption.list()
   * .then(({ shipping_options, count, limit, offset }) => {
   *   console.log(shipping_options)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.shippingOption.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ shipping_options, count, limit, offset }) => {
   *   console.log(shipping_options)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each shipping option:
   * 
   * ```ts
   * sdk.admin.shippingOption.list({
   *   fields: "id,*service_zone"
   * })
   * .then(({ shipping_options, count, limit, offset }) => {
   *   console.log(shipping_options)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminShippingOptionListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionListResponse>(
      `/admin/shipping-options`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method manages the rules of a shipping option to create, update, or remove them. It sends a request to the
   * [Manage Rules of a Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptionsidrulesbatch)
   * API route.
   * 
   * @param id - The ID of the shipping option to manage the rules for.
   * @param body - The details of the shipping option rules to manage.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   * 
   * @example
   * sdk.admin.shippingOption.updateRules("so_123", {
   *   create: [{ attribute: "enabled_in_store", operator: "eq", value: "true" }],
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   */
  async updateRules(
    id: string,
    body: HttpTypes.AdminUpdateShippingOptionRules,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminUpdateShippingOptionRulesResponse>(
      `/admin/shipping-options/${id}/rules/batch`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
