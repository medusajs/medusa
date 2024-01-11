import {
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { Cart } from "@models"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
}

// TODO: implement ICartModuleService from @medusajs/types
export default class CartModuleService<TCart extends Cart = Cart> {
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
