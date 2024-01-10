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

export type FilterableAuthProviderProps = {}
