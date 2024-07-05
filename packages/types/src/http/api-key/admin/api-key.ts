import { ApiKeyType } from "../../../api-key"
import { PaginatedResponse } from "../../../common"

/**
 * @experimental
 */
interface ApiKeyResponse {
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

/**
 * @experimental
 */
export interface AdminApiKeyResponse {
  api_key: ApiKeyResponse
}

/**
 * @experimental
 */
export interface AdminApiKeyListResponse extends PaginatedResponse {
  api_keys: ApiKeyResponse[]
}
