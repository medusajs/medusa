import { ApiKeyType } from "../../../api-key"
import { PaginatedResponse } from "../../common"

interface AdminApiKey {
  id: string
  token: string
  redacted: string
  title: string
  type: ApiKeyType
  last_used_at: Date | null
  created_by: string
  created_at: Date
  revoked_by: string | null
  revoked_at: Date | null
}

export interface AdminApiKeyResponse {
  api_key: AdminApiKey
}

export type AdminApiKeyListResponse = PaginatedResponse<{
  api_keys: AdminApiKey[]
}>
