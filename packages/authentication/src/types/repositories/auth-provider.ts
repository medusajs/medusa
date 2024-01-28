import { AuthProvider } from "@models"

export type CreateAuthProviderDTO = {
  provider: string
  name: string
  domain?: ProviderDomain
  is_active?: boolean
  config?: Record<string, unknown>
}

export type UpdateAuthProviderDTO = {
  update: {
    provider: string
    name?: string
    domain?: ProviderDomain
    is_active?: boolean
    config?: Record<string, unknown>
  }
  provider: AuthProvider
}

export enum ProviderDomain {
  ALL = "all",
  STORE = "store",
  ADMIN = "admin",
}
