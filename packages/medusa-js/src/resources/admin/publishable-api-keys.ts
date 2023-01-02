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
  AdminSalesChannelsListRes,
} from "@medusajs/medusa"

import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminPublishableApiKeyResource extends BaseResource {
  retrieve(
    id: string,
    query?: {},
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    let path = `/admin/publishable-api-keys/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

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

  create(
    payload: AdminPostPublishableApiKeysReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostPublishableApiKeysPublishableApiKeyReq,
    customHeaders: Record<string, any> = {}
  ) {
    const path = `/admin/publishable-api-keys/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeyDeleteRes> {
    const path = `/admin/publishable-api-keys/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  revoke(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys/${id}/revoke`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  addSalesChannelsBatch(
    id: string,
    payload: AdminPostPublishableApiKeySalesChannelsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys/${id}/sales-channels/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteSalesChannelsBatch(
    id: string,
    payload: AdminDeletePublishableApiKeySalesChannelsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPublishableApiKeysRes> {
    const path = `/admin/publishable-api-keys/${id}/sales-channels/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  listSalesChannels(
    id: string,
    query?: GetPublishableApiKeySalesChannelsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsListRes> {
    let path = `/admin/publishable-api-keys/${id}/sales-channels`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminPublishableApiKeyResource
