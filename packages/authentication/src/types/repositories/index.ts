import { AuthProvider, AuthUser } from "@models"
import { CreateAuthProviderDTO, UpdateAuthProviderDTO } from "./auth-provider"
import { DAL } from "@medusajs/types"
import { CreateAuthUserDTO, UpdateAuthUserDTO } from "./auth-user"

export * from "./auth-user"
export * from "./auth-provider"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAuthProviderRepository<
  TEntity extends AuthProvider = AuthProvider
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateAuthProviderDTO
      update: UpdateAuthProviderDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAuthUserRepository<TEntity extends AuthUser = AuthUser>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateAuthUserDTO
      update: UpdateAuthUserDTO
    }
  > {}
