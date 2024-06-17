import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductCategory {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateProductCategory,
    query?: HttpTypes.AdminProductCategoryParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductCategoryResponse>(
      `/admin/product-categories`,
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
    body: HttpTypes.AdminUpdateProductCategory,
    query?: HttpTypes.AdminProductCategoryParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductCategoryResponse>(
      `/admin/product-categories/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminProductCategoryListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductCategoryListResponse>(
      `/admin/product-categories`,
      {
        headers,
        query: query,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminProductCategoryParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductCategoryResponse>(
      `/admin/product-categories/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductCategoryDeleteResponse>(
      `/admin/product-categories/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async updateProducts(
    id: string,
    body: HttpTypes.AdminUpdateProductCategoryProducts,
    query?: HttpTypes.AdminProductCategoryParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductCategoryResponse>(
      `/admin/product-categories/${id}/products`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
