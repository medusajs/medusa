import { ApiKeyType } from "../../../api-key"

export interface AdminCreateApiKey {
  title: string
  type: ApiKeyType
}

export interface AdminUpdateApiKey {
  title: string
}

export interface AdminRevokeApiKey {
  revoke_in?: number
}
