import qs from "qs"

import {
  AdminPublishableApiKeyDeleteRes,
  AdminPublishableApiKeysRes,
  GetPublishableApiKeysParams,
  AdminPublishableApiKeysListRes,
  AdminPostPublishableApiKeysReq,
  AdminPostPublishableApiKeysPublishableApiKeyReq,
  AdminPostPublishableApiKeySalesChannelsBatchReq,
  AdminDeletePublishableApiKeySalesChannelsBatchReq,
  GetPublishableApiKeySalesChannelsParams,
} from "@medusajs/medusa"

import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import { AdminPublishableApiKeysListSalesChannelsRes } from "@medusajs/medusa"

/**
 * This class is used to send requests to [Admin Publishable API Key API Routes](https://docs.medusajs.com/api/admin#publishable-api-keys). All its method
 * are available in the JS Client under the `medusa.admin.publishableApiKeys` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Publishable API Keys can be used to scope Store API calls with an API key, determining what resources are retrieved when querying the API.
 * For example, a publishable API key can be associated with one or more sales channels. When it is passed in the header of a request to the List Product store API Route,
 * the sales channels are inferred from the key and only products associated with those sales channels are retrieved.
 * Admins can manage publishable API keys and their associated resources. Currently, only Sales Channels are supported as a resource.
 * 
 * Related Guide: [How to manage publishable API keys](https://docs.medusajs.com/development/publishable-api-keys/admin/manage-publishable-api-keys).
 */
class AdminPublishableApiKeyResource extends BaseResource {
  /**
   * Retrieve a publishable API key's details.
   * @param {string} id - The ID of the publishable API key.
   * @privateRemarks The query parameter serves no purpose, so will leave this without a description until it's removed/fixed.
   * @param {Record<string, any>} query
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysRes>} Resolves to the publishable API key's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.retrieve(publishableApiKeyId)
   * .then(({ publishable_api_key }) => {
   *   console.log(publishable_api_key.id)
   * })
   */
  retrieve(
    id: string,
    query: Record<string, any> = {},
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    let path = `/admin/publishable-api-keys/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of publishable API keys. The publishable API keys can be filtered by fields such as `q` passed in `query`. The publishable API keys can also be paginated.
   * @param {GetPublishableApiKeysParams} query - Filters and pagination configurations to apply on the retrieved publishable API keys.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysListRes>} Resolves to the list of publishable API keys with pagination fields.
   * 
   * @example
   * To list publishable API keys:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.list()
   * .then(({ publishable_api_keys, count, limit, offset }) => {
   *   console.log(publishable_api_keys)
   * })
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.list({
   *   limit,
   *   offset
   * })
   * .then(({ publishable_api_keys, count, limit, offset }) => {
   *   console.log(publishable_api_keys)
   * })
   * ```
   */
  list(
    query?: GetPublishableApiKeysParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysListRes> {
    let path = `/admin/publishable-api-keys`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Create a publishable API key.
   * @param {AdminPostPublishableApiKeysReq} payload - The publishable API key to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysRes>} Resolves to the publishbale API key's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.create({
   *  title
   * })
   * .then(({ publishable_api_key }) => {
   *   console.log(publishable_api_key.id)
   * })
   */
  create(
    payload: AdminPostPublishableApiKeysReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a publishable API key's details.
   * @param {string} id - The ID of the publishable API key.
   * @param {AdminPostPublishableApiKeysPublishableApiKeyReq} payload - The attributes to update in the publishable API key.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysRes>} Resolves to the publishbale API key's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.update(publishableApiKeyId, {
   *   title: "new title"
   * })
   * .then(({ publishable_api_key }) => {
   *   console.log(publishable_api_key.id)
   * })
   */
  update(
    id: string,
    payload: AdminPostPublishableApiKeysPublishableApiKeyReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a publishable API key. Associated resources, such as sales channels, are not deleted.
   * @param {string} id  - The ID of the publishable API key
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeyDeleteRes>} Resolves to the delete operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.delete(publishableApiKeyId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id)
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeyDeleteRes> {
    const path = `/admin/publishable-api-keys/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Revoke a publishable API key. Revoking the publishable API Key can't be undone, and the key can't be used in future requests.
   * @param {string} id - The ID of the publishable API key.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysRes>} Resolves to the publishbale API key's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.revoke(publishableApiKeyId)
   * .then(({ publishable_api_key }) => {
   *   console.log(publishable_api_key.id)
   * })
   */
  revoke(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys/${id}/revoke`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  /**
   * Add a list of sales channels to a publishable API key.
   * @param {string} id - The ID of the publishable API key.
   * @param {AdminPostPublishableApiKeySalesChannelsBatchReq} payload - The sales channels to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysRes>} Resolves to the publishbale API key's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.addSalesChannelsBatch(publishableApiKeyId, {
   *   sales_channel_ids: [
   *     {
   *       id: channelId
   *     }
   *   ]
   * })
   * .then(({ publishable_api_key }) => {
   *   console.log(publishable_api_key.id);
   * })
   */
  addSalesChannelsBatch(
    id: string,
    payload: AdminPostPublishableApiKeySalesChannelsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys/${id}/sales-channels/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Remove a list of sales channels from a publishable API key. This doesn't delete the sales channels and only removes the association between them and the publishable API key.
   * @param {string} id - The ID of the publishable API key.
   * @param {AdminDeletePublishableApiKeySalesChannelsBatchReq} payload - The sales channels to delete from the publishable API key.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysRes>} Resolves to the publishbale API key's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.deleteSalesChannelsBatch(publishableApiKeyId, {
   *   sales_channel_ids: [
   *     {
   *       id: channelId
   *     }
   *   ]
   * })
   * .then(({ publishable_api_key }) => {
   *   console.log(publishable_api_key.id);
   * })
   */
  deleteSalesChannelsBatch(
    id: string,
    payload: AdminDeletePublishableApiKeySalesChannelsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys/${id}/sales-channels/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * List the sales channels associated with a publishable API key. The sales channels can be filtered by fields such as `q` passed in the `query` parameter.
   * @param {string} id - The ID of the publishable API key.
   * @param {GetPublishableApiKeySalesChannelsParams} query - Filters to apply on the retrieved sales channels.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPublishableApiKeysListSalesChannelsRes>} Resolves to the list of sales channels.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.publishableApiKeys.listSalesChannels()
   * .then(({ sales_channels }) => {
   *   console.log(sales_channels.length)
   * })
   */
  listSalesChannels(
    id: string,
    query?: GetPublishableApiKeySalesChannelsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysListSalesChannelsRes> {
    let path = `/admin/publishable-api-keys/${id}/sales-channels`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminPublishableApiKeyResource
