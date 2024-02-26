import {
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  IStoreModuleService,
  StoreTypes,
} from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

import { Store } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

const generateMethodForModels = []

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  storeService: ModulesSdkTypes.InternalModuleService<any>
}

export default class StoreModuleService<TEntity extends Store = Store>
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    StoreTypes.StoreDTO,
    {
      Store: { dto: StoreTypes.StoreDTO }
    }
  >(Store, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IStoreModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly storeService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, storeService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.storeService_ = storeService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }
}
