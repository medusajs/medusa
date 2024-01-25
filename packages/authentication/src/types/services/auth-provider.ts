import { AbstractService } from "@medusajs/utils"
import { IAuthProviderRepository } from "../repositories"
import { AuthProvider } from "@models"

export interface IAuthProviderService<
  TEntity extends AuthProvider = AuthProvider
> extends AbstractService<
    TEntity,
    {
      authProviderRepository: IAuthProviderRepository<TEntity>
    },
    {
      create: CreateAuthProviderDTO
      update: UpdateAuthProviderDTO
    }
  > {}

export type AuthProviderDTO = {
  provider: string
  name: string
  domain: ProviderDomain
  is_active: boolean
  config: Record<string, unknown>
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

export type FilterableAuthProviderProps = {}
