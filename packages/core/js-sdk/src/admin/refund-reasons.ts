import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class RefundReason {
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
   * This method retrieves a list of refund reasons. It sends a request to the
   * [List Refund Reasons](https://docs.medusajs.com/api/admin#refund-reasons_getrefundreasons)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of refund reasons.
   *
   * @example
   * To retrieve the list of refund reasons:
   *
   * ```ts
   * sdk.admin.refundReason.list()
   * .then(({ refund_reasons, count, limit, offset }) => {
   *   console.log(refund_reasons)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.refundReason.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ refund_reasons, count, limit, offset }) => {
   *   console.log(refund_reasons)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each refund reason:
   *
   * ```ts
   * sdk.admin.refundReason.list({
   *   fields: "id,label"
   * })
   * .then(({ refund_reasons, count, limit, offset }) => {
   *   console.log(refund_reasons)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   *
   */
  async list(
    query?: HttpTypes.AdminRefundReasonListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.RefundReasonsResponse>(
      `/admin/refund-reasons`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method retrieves a refund reason by ID. It sends a request to the
   * [Get Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_getrefundreasonsid)
   * API route.
   *
   * @since 2.11.0
   *
   * @param id - The refund reason's ID.
   * @param query - Configure the fields and relations to retrieve in the refund reason.
   * @param headers - Headers to pass in the request.
   * @returns The refund reason's details.
   *
   * @example
   * To retrieve a refund reason by its ID:
   *
   * ```ts
   * sdk.admin.refundReason.retrieve("refr_123")
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.refundReason.retrieve("refr_123", {
   *   fields: "id,code"
   * })
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminRefundReasonParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRefundReasonResponse>(
      `/admin/refund-reasons/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method creates a refund reason. It sends a request to the
   * [Create Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_postrefundreasons)
   * API route.
   *
   * @since 2.11.0
   *
   * @param body - The details of the refund reason to create.
   * @param query - Configure the fields and relations to retrieve in the refund reason.
   * @param headers - Headers to pass in the request.
   * @returns The refund reason's details.
   *
   * @example
   * sdk.admin.refundReason.create({
   *   code: "refund",
   *   label: "Refund",
   * })
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateRefundReason,
    query?: HttpTypes.AdminRefundReasonParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminRefundReasonResponse>(
      `/admin/refund-reasons`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a refund reason. It sends a request to the
   * [Update Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_postrefundreasonsid)
   * API route.
   *
   * @since 2.11.0
   *
   * @param id - The refund reason's ID.
   * @param body - The details of the refund reason to update.
   * @param query - Configure the fields and relations to retrieve in the refund reason.
   * @param headers - Headers to pass in the request.
   * @returns The refund reason's details.
   *
   * @example
   * sdk.admin.refundReason.update("ret_123", {
   *   code: "refund",
   *   label: "Refund",
   * })
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateRefundReason,
    query?: HttpTypes.AdminRefundReasonParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminRefundReasonResponse>(
      `/admin/refund-reasons/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a refund reason. It sends a request to the
   * [Delete Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_deleterefundreasonsid)
   * API route.
   *
   * @since 2.11.0
   *
   * @param id - The refund reason's ID.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.refundReason.delete("ret_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(
    id: string,
    query?: HttpTypes.AdminRefundReasonParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRefundReasonDeleteResponse>(
      `/admin/refund-reasons/${id}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}
