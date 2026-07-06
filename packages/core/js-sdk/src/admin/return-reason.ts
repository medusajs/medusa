import { HttpTypes } from "@medusajs/types"

import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class ReturnReason {
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
   * This method retrieves a list of return reasons. It sends a request to the
   * [List Return Reasons](https://docs.medusajs.com/api/admin#return-reasons_returnreason_schema)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of return reasons.
   * 
   * @example
   * To retrieve the list of return reasons:
   * 
   * ```ts
   * sdk.admin.returnReason.list()
   * .then(({ return_reasons, count, limit, offset }) => {
   *   console.log(return_reasons)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.returnReason.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ return_reasons, count, limit, offset }) => {
   *   console.log(return_reasons)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each return reason:
   * 
   * ```ts
   * sdk.admin.returnReason.list({
   *   fields: "id,value"
   * })
   * .then(({ return_reasons, count, limit, offset }) => {
   *   console.log(return_reasons)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminReturnReasonListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnReasonListResponse>(
      "/admin/return-reasons",
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a return reason by ID. It sends a request to the
   * [Get Return Reason](https://docs.medusajs.com/api/admin#return-reasons_getreturnreasonsid)
   * API route.
   * 
   * @param id - The return reason's ID.
   * @param query - Configure the fields and relations to retrieve in the return reason.
   * @param headers - Headers to pass in the request.
   * @returns The return reason's details.
   * 
   * @example
   * To retrieve a return reason by its ID:
   * 
   * ```ts
   * sdk.admin.returnReason.retrieve("ret_123")
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.returnReason.retrieve("ret_123", {
   *   fields: "id,value"
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminReturnReasonParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnReasonResponse>(
      `/admin/return-reasons/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method creates a return reason. It sends a request to the
   * [Create Return Reason](https://docs.medusajs.com/api/admin#return-reasons_postreturnreasons)
   * API route.
   * 
   * @param body - The details of the return reason to create.
   * @param query - Configure the fields and relations to retrieve in the return reason.
   * @param headers - Headers to pass in the request.
   * @returns The return reason's details.
   * 
   * @example
   * sdk.admin.returnReason.create({
   *   value: "refund",
   *   label: "Refund",
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateReturnReason,
    query?: HttpTypes.AdminReturnReasonParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminReturnReasonResponse>(
      `/admin/return-reasons`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a return reason. It sends a request to the
   * [Update Return Reason](https://docs.medusajs.com/api/admin#return-reasons_postreturnreasonsid)
   * API route.
   * 
   * @param id - The return reason's ID.
   * @param body - The details of the return reason to update.
   * @param query - Configure the fields and relations to retrieve in the return reason.
   * @param headers - Headers to pass in the request.
   * @returns The return reason's details.
   * 
   * @example
   * sdk.admin.returnReason.update("ret_123", {
   *   value: "refund",
   *   label: "Refund",
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateReturnReason,
    query?: HttpTypes.AdminReturnReasonParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminReturnReasonResponse>(
      `/admin/return-reasons/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a return reason. It sends a request to the
   * [Delete Return Reason](https://docs.medusajs.com/api/admin#return-reasons_deletereturnreasonsid)
   * API route.
   * 
   * @param id - The return reason's ID.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.returnReason.delete("ret_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(
    id: string,
    query?: HttpTypes.AdminReturnReasonParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnReasonDeleteResponse>(
      `/admin/return-reasons/${id}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}
