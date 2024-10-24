import {
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
} from "@medusajs/types"
import { AdminOrderChangesResponse } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Order {
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
   * This method retrieves an order by its ID. It sends a request to the 
   * [Get Order](https://docs.medusajs.com/api/admin#orders_getordersid)
   * API route.
   * 
   * @param id - The order's ID.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   * 
   * @example
   * To retrieve an order by its ID:
   * 
   * ```ts
   * sdk.admin.order.retrieve("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.order.retrieve("order_123", {
   *   fields: "id,*items"
   * })
   * .then(({ order }) => {
   *   console.log(order)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/orders/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method retrieves the preview of an order based on its last associated change. It sends a request to the 
   * [Get Order Preview](https://docs.medusajs.com/api/admin#orders_getordersidpreview) API route.
   * 
   * @param id - The order's ID.
   * @param query - Query parameters.
   * @param headers - Headers to pass in the request
   * @returns The order preview's details.
   * 
   * @example
   * sdk.admin.order.retrievePreview("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  async retrievePreview(
    id: string,
    query?: HttpTypes.AdminOrderFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderPreviewResponse>(
      `/admin/orders/${id}/preview`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method retrieves a paginated list of orders. It sends a request to the 
   * [List Orders](https://docs.medusajs.com/api/admin#orders_getorders) API route.
   * 
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of orders.
   * 
   * @example
   * To retrieve the list of orders:
   * 
   * ```ts
   * sdk.admin.order.list()
   * .then(({ orders, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.order.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ orders, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each order:
   * 
   * ```ts
   * sdk.admin.order.list({
   *   fields: "id,*items"
   * })
   * .then(({ orders, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    queryParams?: HttpTypes.AdminOrderFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      HttpTypes.AdminOrderListResponse
    >(`/admin/orders`, {
      query: queryParams,
      headers,
    })
  }

  /**
   * This method cancels an order. It sends a request to the
   * [Cancel Order](https://docs.medusajs.com/api/admin#orders_postordersidcancel)
   * API route.
   * 
   * @param id - The order's ID.
   * @param headers - Headers to pass in the request.
   * @returns The order's details.
   * 
   * @example
   * sdk.admin.order.cancel("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  async cancel(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/orders/${id}/cancel`,
      {
        method: "POST",
        headers,
      }
    )
  }

  /**
   * This method creates a fulfillment for an order. It sends a request to the
   * [Create Fulfillment](https://docs.medusajs.com/api/admin#orders_postordersidfulfillments)
   * API route.
   * 
   * @param id - The order's ID.
   * @param body - The fulfillment's details.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   * 
   * @example
   * sdk.admin.order.createFulfillment("order_123", {
   *   items: [
   *     {
   *       id: "orli_123",
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  async createFulfillment(
    id: string,
    body: HttpTypes.AdminCreateOrderFulfillment,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/orders/${id}/fulfillments`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method cancels an order's fulfillment. It sends a request to the
   * [Cancel Fulfillment](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idcancel)
   * API route.
   * 
   * @param id - The order's ID.
   * @param fulfillmentId - The ID of the fulfillment to cancel.
   * @param body - The cancelation's details.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   * 
   * @example
   * sdk.admin.order.cancelFulfillment(
   *   "order_123",
   *   "ful_123",
   *   {
   *     no_notification: false
   *   }
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  async cancelFulfillment(
    id: string,
    fulfillmentId: string,
    body: HttpTypes.AdminCancelOrderFulfillment,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/orders/${id}/fulfillments/${fulfillmentId}/cancel`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method creates a shipment for an order's fulfillment. It sends a request to the
   * [Create Shipment](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idshipments)
   * API route.
   * 
   * @param id - The order's ID.
   * @param fulfillmentId - The ID of the fulfillment.
   * @param body - The shipment's details.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   * 
   * @example
   * sdk.admin.order.createShipment(
   *   "order_123",
   *   "ful_123",
   *   {
   *     items: [
   *       {
   *         id: "fulit_123",
   *         quantity: 1
   *       }
   *     ]
   *   }
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  async createShipment(
    id: string,
    fulfillmentId: string,
    body: HttpTypes.AdminCreateOrderShipment,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/orders/${id}/fulfillments/${fulfillmentId}/shipments`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method marks an order's fulfillment as delivered. It sends a request to the
   * [Mark Delivered ](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idmarkasdelivered)
   * API route.
   * 
   * @param id - The order's ID.
   * @param fulfillmentId - The fulfillment's ID.
   * @param body - The delivery details.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   * 
   * @example
   * sdk.admin.order.markAsDelivered(
   *   "order_123",
   *   "ful_123",
   *   {}
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  async markAsDelivered(
    id: string,
    fulfillmentId: string,
    body: HttpTypes.AdminMarkOrderFulfillmentAsDelivered,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/orders/${id}/fulfillments/${fulfillmentId}/mark-as-delivered`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a list of changes made on an order, including returns, exchanges, etc...
   * 
   * This method sends a request to the [List Changes](https://docs.medusajs.com/api/admin#orders_getordersidchanges)
   * API route.
   * 
   * @param id - The order's ID.
   * @param queryParams - Configure the fields to retrieve in each order change.
   * @param headers - Headers to pass in the request
   * @returns The list of order changes.
   * 
   * @example
   * sdk.admin.order.listChanges("order_123")
   * .then(({ order_changes }) => {
   *   console.log(order_changes)
   * })
   */
  async listChanges(
    id: string,
    queryParams?: FindParams & HttpTypes.AdminOrderChangesFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      PaginatedResponse<AdminOrderChangesResponse>
    >(`/admin/orders/${id}/changes`, {
      query: queryParams,
      headers,
    })
  }

  /**
   * This method retrieves the order's line items. It sends a request to the
   * [List Line Items](https://docs.medusajs.com/api/admin#orders_getordersidlineitems)
   * API routes.
   * 
   * @param id - The order's ID.
   * @param queryParams - Configure the fields to retrieve in each line item.
   * @param headers - Headers to pass in the request
   * @returns The list of line items.
   * 
   * @example
   * sdk.admin.order.listLineItems("order_123")
   * .then(({ order_items }) => {
   *   console.log(order_items)
   * })
   */
  async listLineItems(
    id: string,
    queryParams?: FindParams & HttpTypes.AdminOrderItemsFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      HttpTypes.AdminOrderLineItemsListResponse
    >(`/admin/orders/${id}/line-items`, {
      query: queryParams,
      headers,
    })
  }
}
