import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { User } from "@models"

import { ServiceTypes } from "@types"

type InjectedDependencies = {
  userRepository: DAL.RepositoryService
}

export default class UserService<
  TEntity extends User = User
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateUserDTO
    update: ServiceTypes.UpdateUserDTO
  }
>(User)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
