import { BaseFilterable } from "../../dal"

export type AuthUserDTO = {
  id: string
  provider: string
  entity_id: string
  scope: string
  provider_metadata?: Record<string, unknown>
  user_metadata: Record<string, unknown>
  app_metadata: Record<string, unknown>
}

export type CreateAuthUserDTO = {
  id?: string
  provider: string
  entity_id: string
  scope: string
  provider_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export type UpdateAuthUserDTO = {
  id: string
  provider_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export interface FilterableAuthUserProps
  extends BaseFilterable<FilterableAuthUserProps> {
  id?: string[]
  provider?: string[] | string
}
