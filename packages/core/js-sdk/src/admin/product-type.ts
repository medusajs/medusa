import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class ProductType {
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
   * This method creates a product type. It sends a request to the
   * [Create Product Type](https://docs.medusajs.com/api/admin#product-types_postproducttypes)
   * API route.
   * 
   * @param body - The product type's details.
   * @param query - Configure the fields to retrieve in the product type.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   * 
   * @example
   * sdk.admin.productType.create({
   *   value: "Clothes"
   * })
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateProductType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeResponse>(
      `/admin/product-types`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a product type. It sends a request to the
   * [Update Product Type](https://docs.medusajs.com/api/admin#product-types_postproducttypesid)
   * API route.
   * 
   * @param id - The product type's ID.
   * @param body - The data to update in the product type.
   * @param query - Configure the fields to retrieve in the product type.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   * 
   * @example
   * sdk.admin.productType.update("ptyp_123", {
   *   value: "Clothes"
   * })
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateProductType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeResponse>(
      `/admin/product-types/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of product types. It sends a request to the 
   * [List Product Types](https://docs.medusajs.com/api/admin#product-types_getproducttypes) API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product types.
   * 
   * @example
   * To retrieve the list of product types:
   * 
   * ```ts
   * sdk.admin.productType.list()
   * .then(({ product_types, count, limit, offset }) => {
   *   console.log(product_types)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.productType.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_types, count, limit, offset }) => {
   *   console.log(product_types)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product type:
   * 
   * ```ts
   * sdk.admin.productType.list({
   *   fields: "id,*products"
   * })
   * .then(({ product_types, count, limit, offset }) => {
   *   console.log(product_types)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminProductTypeListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeListResponse>(
      `/admin/product-types`,
      {
        headers,
        query: query,
      }
    )
  }

  /**
   * This method retrieves a product type by its ID. It sends a request to the 
   * [Get Product Type](https://docs.medusajs.com/api/admin#product-types_getproducttypesid)
   * API route.
   * 
   * @param id - The product type's ID.
   * @param query - Configure the fields to retrieve in the product type.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   * 
   * @example
   * To retrieve a product type by its ID:
   * 
   * ```ts
   * sdk.admin.productType.retrieve("ptyp_123")
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.productType.retrieve("ptyp_123", {
   *   fields: "id,*products"
   * })
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminProductTypeParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeResponse>(
      `/admin/product-types/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a product type. It sends a request to the 
   * [Delete Product Type](https://docs.medusajs.com/api/admin#product-types_deleteproducttypesid)
   * API route.
   * 
   * @param id - The product type's ID.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   * 
   * @example
   * sdk.admin.productType.delete("ptyp_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductTypeDeleteResponse>(
      `/admin/product-types/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
