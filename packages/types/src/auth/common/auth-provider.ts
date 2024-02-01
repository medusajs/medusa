import { BaseFilterable } from "../../dal"

export type AuthProviderDTO = {
  provider: string
  name: string
  scope?: string
  is_active: boolean
  config: Record<string, unknown> | null
}

export type CreateAuthProviderDTO = {
  provider: string
  name: string
  scope?: string
  is_active?: boolean
  config?: Record<string, unknown>
}

export type UpdateAuthProviderDTO = {
  provider: string
  name?: string
  is_active?: boolean
  config?: Record<string, unknown>
}

export interface FilterableAuthProviderProps
  extends BaseFilterable<FilterableAuthProviderProps> {
  provider?: string[]
  is_active?: boolean
  scope?: string[]
  name?: string[]
}
