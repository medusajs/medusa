import { ApiKeyListRes, ApiKeyRes } from "../../types/api-responses"
import { makeRequest } from "./common"

const retrieveApiKey = async (id: string, query?: Record<string, any>) => {
  return makeRequest<ApiKeyRes, Record<string, any>>(
    `/admin/api-keys/${id}`,
    query
  )
}

const listApiKeys = async (query?: Record<string, any>) => {
  return makeRequest<ApiKeyListRes, Record<string, any>>(
    `/admin/api-keys`,
    query
  )
}

export const apiKeys = {
  retrieve: retrieveApiKey,
  list: listApiKeys,
}
