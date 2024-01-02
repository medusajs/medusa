import {
  AuthenticationTypes,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { AuthUser } from "@models"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
}

export default class AuthenticationModuleService<
  TAuthUser extends AuthUser = AuthUser
> implements AuthenticationTypes.IAuthenticationModuleService
{
  protected baseRepository_: DAL.RepositoryService

  constructor(
    { baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }
}
