import {
  Context,
  DAL,
  FulfillmentTypes,
  IFulfillmentModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"
import { InjectTransactionManager, ModulesSdkUtils } from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { FulfillmentSet } from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  fulfillmentService: ModulesSdkTypes.InternalModuleService<any>
}

export default class FulfillmentModuleService<
    TEntity extends FulfillmentSet = FulfillmentSet
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    any, // TODO Create appropriate DTO
    {}
  >(FulfillmentSet, [], entityNameToLinkableKeysMap)
  implements IFulfillmentModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly fulfillmentService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, fulfillmentService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.fulfillmentService_ = fulfillmentService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  create(
    data: any[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentDTO[]>

  create(
    data: any,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentDTO>

  // TODO Implement the methods from the interface and change type
  @InjectTransactionManager("baseRepository_")
  async create(
    data: any[] | any,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.FulfillmentDTO | FulfillmentTypes.FulfillmentDTO[]
  > {
    return await Promise.resolve(
      [] as FulfillmentTypes.FulfillmentDTO[] | FulfillmentTypes.FulfillmentDTO
    )
  }

  // TODO Implement the methods from the interface and change type
  update(
    data: any[],
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentDTO[]>
  update(
    data: any,
    sharedContext?: Context
  ): Promise<FulfillmentTypes.FulfillmentDTO>

  @InjectTransactionManager("baseRepository_")
  async update(
    data: any,
    sharedContext?: Context
  ): Promise<
    FulfillmentTypes.FulfillmentDTO | FulfillmentTypes.FulfillmentDTO[]
  > {
    return await Promise.resolve(
      [] as FulfillmentTypes.FulfillmentDTO[] | FulfillmentTypes.FulfillmentDTO
    )
  }
}
