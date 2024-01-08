import { BaseFilterable } from "../../dal"

export type AuthProviderDTO = {
  provider: string
  name: string
  domain: ProviderDomain
  is_active: boolean
}

export type CreateAuthProviderDTO = {
  provider: string
  name: string
  domain?: ProviderDomain
  is_active?: boolean
}

export type UpdateAuthProviderDTO = {
  provider: string
  name?: string
  domain?: ProviderDomain
  is_active?: boolean
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
