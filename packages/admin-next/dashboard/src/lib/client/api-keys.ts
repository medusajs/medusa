import { CreateApiKeyReq, UpdateApiKeyReq } from "../../types/api-payloads"
import {
  ApiKeyDeleteRes,
  ApiKeyListRes,
  ApiKeyRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

const retrieveApiKey = async (id: string, query?: Record<string, any>) => {
  return getRequest<ApiKeyRes>(`/admin/api-keys/${id}`, query)
}

const listApiKeys = async (query?: Record<string, any>) => {
  return getRequest<ApiKeyListRes>(`/admin/api-keys`, query)
}

const deleteApiKey = async (id: string) => {
  return deleteRequest<ApiKeyDeleteRes>(`/admin/api-keys/${id}`)
}

const revokeApiKey = async (id: string) => {
  return postRequest<ApiKeyRes>(`/admin/api-keys/${id}/revoke`)
}

const createApiKey = async (payload: CreateApiKeyReq) => {
  return postRequest<ApiKeyRes>(`/admin/api-keys`, payload)
}

const updateApiKey = async (id: string, payload: UpdateApiKeyReq) => {
  return postRequest<ApiKeyRes>(`/admin/api-keys/${id}`, payload)
}

export const apiKeys = {
  retrieve: retrieveApiKey,
  list: listApiKeys,
  delete: deleteApiKey,
  create: createApiKey,
  update: updateApiKey,
  revoke: revokeApiKey,
}
