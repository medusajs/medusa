import { BaseFilterable } from "../../dal"

export type ApiKeyType = "secret" | "publishable"
export interface ApiKeyDTO {
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

export interface FilterableApiKeyProps
  extends BaseFilterable<FilterableApiKeyProps> {
  id?: string | string[]
  token?: string | string[]
  title?: string | string[]
  type?: ApiKeyType
}
