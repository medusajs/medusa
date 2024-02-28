import {
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ICurrencyModuleService,
  CurrencyTypes,
  Context,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  isString,
  promiseAll,
  removeUndefined,
} from "@medusajs/utils"

import { Currency } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

const generateMethodForModels = []

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  currencyService: ModulesSdkTypes.InternalModuleService<any>
}

export default class CurrencyModuleService<TEntity extends Currency = Currency>
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    CurrencyTypes.CurrencyDTO,
    {
      Currency: { dto: CurrencyTypes.CurrencyDTO }
    }
  >(Currency, generateMethodForModels, entityNameToLinkableKeysMap)
  implements ICurrencyModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly currencyService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, currencyService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.currencyService_ = currencyService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }
}
