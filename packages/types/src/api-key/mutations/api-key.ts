import { ApiKeyType } from "../common"

export interface CreateApiKeyDTO {
  title: string
  type: ApiKeyType
  created_by: string
  // We could add revoked_at as a parameter (or expires_at that gets mapped to revoked_at internally) in order to support expiring tokens
}

export interface UpsertApiKeyDTO {
  id?: string
  title?: string
  type?: ApiKeyType
  created_by?: string
}

export interface UpdateApiKeyDTO {
  title?: string
}

export interface RevokeApiKeyDTO {
  revoked_by: string
  revoke_in?: number // Seconds after which the token should be considered revoked
}
