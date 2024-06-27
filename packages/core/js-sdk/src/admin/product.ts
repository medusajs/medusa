import {
  AdminBatchProductVariantInventoryItemRequest,
  AdminBatchProductVariantInventoryItemResponse,
  HttpTypes,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Product {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async batch(
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
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
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
    queryParams?: HttpTypes.AdminProductListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductListResponse>(
      `/admin/products`,
      {
        headers,
        query: queryParams,
      }
    )
  }
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${id}`,
      {
        query,
        headers,
      }
    )
  }
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductDeleteResponse>(
      `/admin/products/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchVariants(
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

  async createVariant(
    productId: string,
    body: HttpTypes.AdminCreateProductVariant,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${productId}/variants`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateVariant(
    productId: string,
    id: string,
    body: HttpTypes.AdminUpdateProductVariant,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
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
    return await this.client.fetch<HttpTypes.AdminProductVariantListResponse>(
      `/admin/products/${productId}/variants`,
      {
        headers,
        query: queryParams,
      }
    )
  }

  async retrieveVariant(
    productId: string,
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductVariantResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async deleteVariant(productId: string, id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductVariantDeleteResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchVariantInventoryItems(
    productId: string,
    body: HttpTypes.AdminBatchProductVariantInventoryItemRequest,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchProductVariantInventoryItemResponse>(
      `/admin/products/${productId}/variants/inventory-items/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async createOption(
    productId: string,
    body: HttpTypes.AdminCreateProductOption,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${productId}/options`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateOption(
    productId: string,
    id: string,
    body: HttpTypes.AdminUpdateProductOption,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
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
    return await this.client.fetch<HttpTypes.AdminProductOptionListResponse>(
      `/admin/products/${productId}/options`,
      {
        headers,
        query: queryParams,
      }
    )
  }

  async retrieveOption(
    productId: string,
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/products/${productId}/options/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async deleteOption(productId: string, id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductOptionDeleteResponse>(
      `/admin/products/${productId}/options/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
