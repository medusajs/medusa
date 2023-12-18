import {
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PromotionTypes,
} from "@medusajs/types"

import { Promotion } from "@models"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
}

export default class PromotionModuleService<
  TPromotion extends Promotion = Promotion
> implements PromotionTypes.IPromotionModuleService
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
