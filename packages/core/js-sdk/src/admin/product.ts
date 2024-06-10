import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Product {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async batchCreate(
    body: HttpTypes.AdminBatchProductRequest,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchProductResponse>(
      `/admin/products/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
  async create(
    body: HttpTypes.AdminCreateProduct,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products`,
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
    body: HttpTypes.AdminUpdateProduct,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
  async list(
    queryParams?: HttpTypes.AdminProductParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductListResponse>(
      `/admin/products`,
      {
        headers,
        query: queryParams,
      }
    )
  }
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${id}`,
      {
        query,
        headers,
      }
    )
  }
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductDeleteResponse>(
      `/admin/products/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchCreateVariants(
    productId: string,
    body: HttpTypes.AdminBatchProductVariantRequest,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchProductVariantResponse>(
      `/admin/products/${productId}/variants/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
  async createVariants(
    productId: string,
    body: HttpTypes.AdminCreateProductVariant,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductVariantResponse>(
      `/admin/products/${productId}/variants`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
  async updateVariants(
    productId: string,
    id: string,
    body: HttpTypes.AdminUpdateProductVariant,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductVariantResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
  async listVariants(
    productId: string,
    queryParams?: HttpTypes.AdminProductVariantParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductVariantListResponse>(
      `/admin/products/${productId}/variants`,
      {
        headers,
        query: queryParams,
      }
    )
  }
  async retrieveVariants(
    productId: string,
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductVariantResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        query,
        headers,
      }
    )
  }
  async deleteVariants(productId: string, id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductVariantDeleteResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
  async createOptions(
    productId: string,
    body: HttpTypes.AdminCreateProductOption,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/products/${productId}/options`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
  async updateOptions(
    productId: string,
    id: string,
    body: HttpTypes.AdminUpdateProductOption,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
  async listOptions(
    productId: string,
    queryParams?: HttpTypes.AdminProductOptionParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionListResponse>(
      `/admin/products/${productId}/options`,
      {
        headers,
        query: queryParams,
      }
    )
  }
  async retrieveOptions(
    productId: string,
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/products/${productId}/options/${id}`,
      {
        query,
        headers,
      }
    )
  }
  async deleteOptions(productId: string, id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductOptionDeleteResponse>(
      `/admin/products/${productId}/options/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
