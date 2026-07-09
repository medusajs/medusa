import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"
import { HttpTypes, SelectParams } from "@medusajs/types"

export class ProductOption {
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
   * This method creates a product option. It sends a request to the
   * [Create Option](https://docs.medusajs.com/api/admin#product-options_postproductoptions)
   * API route.
   *
   * @param body - The details of the option to create.
   * @param query - Configure the fields to retrieve in the option.
   * @param headers - Headers to pass in the request
   * @returns The option's details.
   *
   * @example
   * sdk.admin.productOption.create({
   *   title: "Size",
   *   values: ["S", "M"]
   * })
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateProductOption,
    query?: HttpTypes.AdminProductOptionParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/product-options`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a product option. It sends a request to the
   * [Update Option](https://docs.medusajs.com/api/admin#product-options_postproductoptionsid)
   * API route.
   *
   * @param id - The product option's ID.
   * @param body - The data to update in the option.
   * @param query - Configure the fields to retrieve in the option.
   * @param headers - Headers to pass in the request
   * @returns The option's details.
   *
   * @example
   * sdk.admin.productOption.update("opt_123", {
   *   title: "Size"
   * })
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateProductOption,
    query?: HttpTypes.AdminProductOptionParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/product-options/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of product options. It sends a request to the
   * [List Product Options API route](https://docs.medusajs.com/api/admin#product-options_getproductoptions).
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product options.
   *
   * @example
   * To retrieve the list of product options:
   *
   * ```ts
   * sdk.admin.productOption.list()
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.productOption.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each collection:
   *
   * ```ts
   * sdk.admin.productOption.list({
   *   fields: "id,title"
   * })
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    queryParams?: HttpTypes.AdminProductOptionListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionListResponse>(
      `/admin/product-options`,
      {
        headers,
        query: queryParams,
      }
    )
  }

  /**
   * This method retrieves a product option by its ID. It sends a request to the
   * [Get Product Option API route](https://docs.medusajs.com/api/admin#product-options_getproductoptionsid).
   *
   * @param id - The product option's ID.
   * @param query - Configure the fields to retrieve in the product option.
   * @param headers - Headers to pass in the request
   * @returns The product option's details.
   *
   * @example
   * To retrieve a product option by its ID:
   *
   * ```ts
   * sdk.admin.productOption.retrieve("opt_123")
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.productOption.retrieve("opt_123", {
   *   fields: "id,title"
   * })
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/product-options/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a product option. It sends a request to the
   * [Delete Product Option API route](https://docs.medusajs.com/api/admin#product-options_deleteproductoptionsid).
   *
   * @param id - The product option's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.productOption.delete("opt_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductOptionDeleteResponse>(
      `/admin/product-options/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a paginated list of a product option's values. It sends a
   * request to the List Product Option Values Admin API route.
   *
   * @param optionId - The product option's ID.
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product option values.
   *
   * @example
   * sdk.admin.productOption.listValues("opt_123", { q: "red" })
   * .then(({ product_option_values, count, limit, offset }) => {
   *   console.log(product_option_values)
   * })
   */
  async listValues(
    optionId: string,
    query?: HttpTypes.AdminProductOptionValueListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionValueListResponse>(
      `/admin/product-options/${optionId}/values`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method retrieves a product option value by its ID. It sends a request to the
   * Get Product Option Value Admin API route.
   *
   * @param optionId - The product option's ID.
   * @param valueId - The product option value's ID.
   * @param query - Configure the fields to retrieve in the option value.
   * @param headers - Headers to pass in the request
   * @returns The product option value's details.
   *
   * @example
   * sdk.admin.productOption.retrieveValue("opt_123", "optval_123")
   * .then(({ product_option_value }) => {
   *   console.log(product_option_value)
   * })
   */
  async retrieveValue(
    optionId: string,
    valueId: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionValueResponse>(
      `/admin/product-options/${optionId}/values/${valueId}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method updates a product option value. It sends a request to the
   * Update Product Option Value Admin API route.
   *
   * @param optionId - The product option's ID.
   * @param valueId - The product option value's ID.
   * @param body - The data to update in the option value.
   * @param query - Configure the fields to retrieve in the option value.
   * @param headers - Headers to pass in the request
   * @returns The product option value's details.
   *
   * @example
   * sdk.admin.productOption.updateValue("opt_123", "optval_123", {
   *   metadata: { is_default: true }
   * })
   * .then(({ product_option_value }) => {
   *   console.log(product_option_value)
   * })
   */
  async updateValue(
    optionId: string,
    valueId: string,
    body: HttpTypes.AdminUpdateProductOptionValue,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionValueResponse>(
      `/admin/product-options/${optionId}/values/${valueId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a product option value. It sends a request to the
   * Delete Product Option Value Admin API route.
   *
   * @param optionId - The product option's ID.
   * @param valueId - The product option value's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.productOption.deleteValue("opt_123", "optval_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async deleteValue(
    optionId: string,
    valueId: string,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionValueDeleteResponse>(
      `/admin/product-options/${optionId}/values/${valueId}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
