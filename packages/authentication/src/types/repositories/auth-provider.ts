import { AuthProvider } from "@models"

export type CreateAuthProviderDTO = {
  provider: string
  name: string
  domain?: ProviderDomain
  is_active?: boolean
}

export type UpdateAuthProviderDTO = {
  update: {
    provider: string
    name?: string
    domain?: ProviderDomain
    is_active?: boolean
  }
  provider: AuthProvider
}

export enum ProviderDomain {
  ALL = "all",
  STORE = "store",
  ADMIN = "admin",
}
