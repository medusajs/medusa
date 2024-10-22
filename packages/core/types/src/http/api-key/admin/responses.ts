import { ApiKeyType } from "../../../api-key"
import { DeleteResponse, PaginatedResponse } from "../../common"

interface AdminApiKey {
  /**
   * The API key's ID.
   */
  id: string
  /**
   * The API key's token.
   */
  token: string
  /**
   * The redacted form of the token, useful 
   * for displaying the API key.
   */
  redacted: string
  /**
   * The API key's title.
   */
  title: string
  /**
   * The API key's type.
   */
  type: ApiKeyType
  /**
   * The date the API key was last used.
   */
  last_used_at: Date | null
  /**
   * The ID of the user that created the API key.
   */
  created_by: string
  /**
   * The date the API key was created.
   */
  created_at: Date
  /**
   * The date the API key was updated.
   */
  updated_at: Date
  /**
   * The ID of the user that revoked the API key.
   */
  revoked_by: string | null
  /**
   * The date the API key was revoked.
   */
  revoked_at: Date | null
  /**
   * The date the API key was deleted.
   */
  deleted_at: Date | null
}

export interface AdminApiKeyResponse {
  /**
   * The API key's details.
   */
  api_key: AdminApiKey
}

export type AdminApiKeyListResponse = PaginatedResponse<{
  /**
   * The list of API keys.
   */
  api_keys: AdminApiKey[]
}>

export type AdminApiKeyDeleteResponse = DeleteResponse<"api_key">
