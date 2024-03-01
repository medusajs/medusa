import {
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  IStoreModuleService,
  StoreTypes,
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

import { Store } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { UpdateStoreInput } from "@types"

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

  async create(
    data: StoreTypes.CreateStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  async create(
    data: StoreTypes.CreateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>
  @InjectManager("baseRepository_")
  async create(
    data: StoreTypes.CreateStoreDTO | StoreTypes.CreateStoreDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<StoreTypes.StoreDTO | StoreTypes.StoreDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.create_(input, sharedContext)

    return await this.baseRepository_.serialize<StoreTypes.StoreDTO[]>(
      Array.isArray(data) ? result : result[0]
    )
  }

  @InjectTransactionManager("baseRepository_")
  async create_(
    data: StoreTypes.CreateStoreDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Store[]> {
    let normalizedInput = StoreModuleService.normalizeInput(data)
    return await this.storeService_.create(normalizedInput, sharedContext)
  }

  async upsert(
    data: StoreTypes.UpsertStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  async upsert(
    data: StoreTypes.UpsertStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>
  @InjectTransactionManager("baseRepository_")
  async upsert(
    data: StoreTypes.UpsertStoreDTO | StoreTypes.UpsertStoreDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<StoreTypes.StoreDTO | StoreTypes.StoreDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (store): store is UpdateStoreInput => !!store.id
    )
    const forCreate = input.filter(
      (store): store is StoreTypes.CreateStoreDTO => !store.id
    )

    const operations: Promise<Store[]>[] = []

    if (forCreate.length) {
      operations.push(this.create_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.update_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()
    return await this.baseRepository_.serialize<
      StoreTypes.StoreDTO[] | StoreTypes.StoreDTO
    >(Array.isArray(data) ? result : result[0])
  }

  async update(
    id: string,
    data: StoreTypes.UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>
  async update(
    selector: StoreTypes.FilterableStoreProps,
    data: StoreTypes.UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  @InjectManager("baseRepository_")
  async update(
    idOrSelector: string | StoreTypes.FilterableStoreProps,
    data: StoreTypes.UpdateStoreDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<StoreTypes.StoreDTO | StoreTypes.StoreDTO[]> {
    let normalizedInput: UpdateStoreInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const stores = await this.storeService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = stores.map((store) => ({
        id: store.id,
        ...data,
      }))
    }

    const updateResult = await this.update_(normalizedInput, sharedContext)

    const stores = await this.baseRepository_.serialize<
      StoreTypes.StoreDTO[] | StoreTypes.StoreDTO
    >(updateResult)

    return isString(idOrSelector) ? stores[0] : stores
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdateStoreInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Store[]> {
    const normalizedInput = StoreModuleService.normalizeInput(data)
    return await this.storeService_.update(normalizedInput, sharedContext)
  }

  private static normalizeInput<T extends StoreTypes.UpdateStoreDTO>(
    stores: T[]
  ): T[] {
    return stores.map((store) =>
      removeUndefined({
        ...store,
        name: store.name?.trim(),
      })
    )
  }
}
