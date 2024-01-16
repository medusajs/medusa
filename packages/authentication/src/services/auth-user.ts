import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { AuthUser } from "@models"

import { ServiceTypes } from "@types"

type InjectedDependencies = {
  authUserRepository: DAL.RepositoryService
}

export default class AuthUserService<
  TEntity extends AuthUser = AuthUser
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateAuthUserDTO
    update: ServiceTypes.UpdateAuthUserDTO
  }
>(AuthUser)<TEntity> {}
