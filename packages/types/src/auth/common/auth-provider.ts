import { BaseFilterable } from "../../dal"

export type AuthProviderDTO = {
  provider: string
  name: string
  domain: ProviderDomain
  is_active: boolean
  config: Record<string, unknown> | null
}

export type CreateAuthProviderDTO = {
  provider: string
  name: string
  domain?: ProviderDomain
  is_active?: boolean
  config?: Record<string, unknown> 
}

export type UpdateAuthProviderDTO = {
  provider: string
  name?: string
  domain?: ProviderDomain
  is_active?: boolean
  config?: Record<string, unknown>
}

export enum ProviderDomain {
  ALL = "all",
  STORE = "store",
  ADMIN = "admin",
}

export interface FilterableAuthProviderProps
  extends BaseFilterable<FilterableAuthProviderProps> {
  provider?: string[]
  is_active?: boolean
  domain?: ProviderDomain[]
  name?: string[]
}
