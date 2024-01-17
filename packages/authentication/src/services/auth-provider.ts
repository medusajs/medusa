import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { AuthProvider } from "@models"

import { ServiceTypes } from "@types"

type InjectedDependencies = {
  authProviderRepository: DAL.RepositoryService
}

export default class AuthProviderService<
  TEntity extends AuthProvider = AuthProvider
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateAuthProviderDTO
    update: ServiceTypes.UpdateAuthProviderDTO
  }
>(AuthProvider)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
