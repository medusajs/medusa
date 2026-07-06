import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class ProductTag {
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
   * This method creates a product tag. It sends a request to the 
   * [Create Product Tag](https://docs.medusajs.com/api/admin#product-tags_postproducttags)
   * API route.
   * 
   * @param body - The details of the product tag.
   * @param query - Configure the fields to retrieve in the product tag.
   * @param headers - Headers to pass in the request
   * @returns The product tag's details.
   * 
   * @example
   * sdk.admin.productTag.create({
   *   value: "shirt"
   * })
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateProductTag,
    query?: HttpTypes.AdminProductTagParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagResponse>(
      `/admin/product-tags`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a tag's details. It sends a request to the
   * [Update Product Tag](https://docs.medusajs.com/api/admin#product-tags_postproducttagsid)
   * API route.
   * 
   * @param id - The tag's ID.
   * @param body - The data to update in the tag.
   * @param query - Configure the fields to retrieve in the product tag.
   * @param headers - Headers to pass in the request
   * @returns The product tag's details.
   * 
   * @example
   * sdk.admin.productTag.update("ptag_123", {
   *   value: "shirt"
   * })
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateProductTag,
    query?: HttpTypes.AdminProductTagParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagResponse>(
      `/admin/product-tags/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of product tags. It sends a request to the 
   * [List Product Tags](https://docs.medusajs.com/api/admin#product-tags_getproducttags) API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product tags.
   * 
   * @example
   * To retrieve the list of product tags:
   * 
   * ```ts
   * sdk.admin.productTag.list()
   * .then(({ product_tags, count, limit, offset }) => {
   *   console.log(product_tags)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.productTag.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_tags, count, limit, offset }) => {
   *   console.log(product_tags)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product tag:
   * 
   * ```ts
   * sdk.admin.productTag.list({
   *   fields: "id,*products"
   * })
   * .then(({ product_tags, count, limit, offset }) => {
   *   console.log(product_tags)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminProductTagListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagListResponse>(
      `/admin/product-tags`,
      {
        headers,
        query: query,
      }
    )
  }

  /**
   * This method retrieves a product tag by its ID. It sends a request to the 
   * [Get Product Tag](https://docs.medusajs.com/api/admin#product-tags_getproducttagsid) API route.
   * 
   * @param id - The product tag's ID.
   * @param query - Configure the fields to retrieve in the product tag.
   * @param headers - Headers to pass in the request
   * @returns The product tag's details.
   * 
   * @example
   * To retrieve a product tag by its ID:
   * 
   * ```ts
   * sdk.admin.productTag.retrieve("ptag_123")
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.productTag.retrieve("ptag_123", {
   *   fields: "id,*products"
   * })
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminProductTagParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagResponse>(
      `/admin/product-tags/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a product tag. It sends a request to the
   * [Delete Product Tag](https://docs.medusajs.com/api/admin#product-tags_deleteproducttagsid)
   * API route.
   * 
   * @param id - The tag's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.productTag.delete("ptag_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductTagDeleteResponse>(
      `/admin/product-tags/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
