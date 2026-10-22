import { OrderTagDTO } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export interface AdminCreateOrderTag {
  value: string
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateOrderTag {
  value?: string
  metadata?: Record<string, unknown> | null
}

export interface AdminOrderTagResponse {
  order_tag: OrderTagDTO
}

export interface AdminOrderTagListParams {
  q?: string
  id?: string | string[]
  value?: string | string[]
  limit?: number
  offset?: number
  fields?: string
}

export interface AdminOrderTagListResponse {
  order_tags: OrderTagDTO[]
  count: number
  offset: number
  limit: number
}

export interface AdminOrderTagDeleteResponse {
  id: string
  object: "order_tag"
  deleted: boolean
}

export class OrderTags {
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
   * This method creates an order tag. It sends a request to the
   * [Create Order Tag](https://docs.medusajs.com/api/admin/order-tags/create-order-tag)
   * API route.
   *
   * @param body - The details of the order tag.
   * @param query - Configure the fields to retrieve in the order tag.
   * @param headers - Headers to pass in the request
   * @returns The order tag's details.
   *
   * @example
   * sdk.admin.orderTags.create({
   *   value: "urgent",
   * })
   * .then(({ order_tag }) => {
   *   console.log(order_tag)
   * })
   */
  async create(
    body: AdminCreateOrderTag,
    query?: Record<string, any>,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<AdminOrderTagResponse>(`/admin/order-tags`, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  /**
   * This method retrieves a paginated list of order tags. It sends a request to the
   * [List Order Tags](https://docs.medusajs.com/api/admin/order-tags/list-order-tags) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of order tags.
   *
   * @example
   * To retrieve the list of order tags:
   *
   * ```ts
   * sdk.admin.orderTags.list()
   * .then(({ order_tags, count, limit, offset }) => {
   *   console.log(order_tags)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.orderTags.list({
   *   limit: 10,
   *   offset: 10,
   * })
   * .then(({ order_tags, count, limit, offset }) => {
   *   console.log(order_tags)
   * })
   * ```
   */
  async list(query?: AdminOrderTagListParams, headers?: ClientHeaders) {
    return this.client.fetch<AdminOrderTagListResponse>(`/admin/order-tags`, {
      headers,
      query,
    })
  }

  /**
   * This method updates an order tag. It sends a request to the
   * [Update Order Tag](https://docs.medusajs.com/api/admin/order-tags/update-an-order-tag)
   * API route.
   *
   * @param id - The order tag's ID.
   * @param body - The data to update in the order tag.
   * @param query - Configure the fields to retrieve in the order tag.
   * @param headers - Headers to pass in the request
   * @returns The order tag's details.
   *
   * @example
   * sdk.admin.orderTags.update("ordtag_123", {
   *   value: "urgent",
   * })
   * .then(({ order_tag }) => {
   *   console.log(order_tag)
   * })
   */
  async update(
    id: string,
    body: AdminUpdateOrderTag,
    query?: Record<string, any>,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<AdminOrderTagResponse>(
      `/admin/order-tags/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes an order tag by its ID. It sends a request to the
   * [Delete Order Tag](https://docs.medusajs.com/api/admin/order-tags/delete-an-order-tag)
   * API route.
   *
   * @param id - The order tag's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.orderTags.delete("ordtag_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<AdminOrderTagDeleteResponse>(
      `/admin/order-tags/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
