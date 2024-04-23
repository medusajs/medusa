import { AdminApiKeyListResponse, AdminApiKeyResponse } from "@medusajs/types"
import { CreateApiKeyReq, UpdateApiKeyReq } from "../../types/api-payloads"
import { ApiKeyDeleteRes } from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

const retrieveApiKey = async (id: string, query?: Record<string, any>) => {
  return getRequest<AdminApiKeyResponse>(`/admin/api-keys/${id}`, query)
}

const listApiKeys = async (query?: Record<string, any>) => {
  return getRequest<AdminApiKeyListResponse>(`/admin/api-keys`, query)
}

const deleteApiKey = async (id: string) => {
  return deleteRequest<ApiKeyDeleteRes>(`/admin/api-keys/${id}`)
}

const revokeApiKey = async (id: string) => {
  return postRequest<AdminApiKeyResponse>(`/admin/api-keys/${id}/revoke`)
}

const createApiKey = async (payload: CreateApiKeyReq) => {
  return postRequest<AdminApiKeyResponse>(`/admin/api-keys`, payload)
}

const updateApiKey = async (id: string, payload: UpdateApiKeyReq) => {
  return postRequest<AdminApiKeyResponse>(`/admin/api-keys/${id}`, payload)
}

const batchRemoveSalesChannelsFromApiKey = async (
  id: string,
  payload: { sales_channel_ids: string[] }
) => {
  return postRequest<AdminApiKeyResponse>(
    `/admin/api-keys/${id}/sales-channels`,
    {
      remove: payload.sales_channel_ids,
    }
  )
}

const batchAddSalesChannelsFromApiKey = async (
  id: string,
  payload: { sales_channel_ids: string[] }
) => {
  return postRequest<AdminApiKeyResponse>(
    `/admin/api-keys/${id}/sales-channels`,
    {
      add: payload.sales_channel_ids,
    }
  )
}

export const apiKeys = {
  retrieve: retrieveApiKey,
  list: listApiKeys,
  delete: deleteApiKey,
  create: createApiKey,
  update: updateApiKey,
  revoke: revokeApiKey,
  batchRemoveSalesChannels: batchRemoveSalesChannelsFromApiKey,
  batchAddSalesChannels: batchAddSalesChannelsFromApiKey,
}
