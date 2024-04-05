import { ApiKeyListRes, ApiKeyRes } from "../../types/api-responses"
import { getRequest } from "./common"

const retrieveApiKey = async (id: string, query?: Record<string, any>) => {
  return getRequest<ApiKeyRes>(`/admin/api-keys/${id}`, query)
}

const listApiKeys = async (query?: Record<string, any>) => {
  return getRequest<ApiKeyListRes>(`/admin/api-keys`, query)
}

export const apiKeys = {
  retrieve: retrieveApiKey,
  list: listApiKeys,
}
