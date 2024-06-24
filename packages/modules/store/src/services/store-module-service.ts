import {
  Context,
  DAL,
  InternalModuleDeclaration,
  IStoreModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  StoreTypes,
} from "@medusajs/types"
import {
  getDuplicates,
  InjectManager,
  InjectTransactionManager,
  isString,
  MedusaContext,
  MedusaError,
  MedusaService,
  promiseAll,
  removeUndefined,
} from "@medusajs/utils"

import { Store, StoreCurrency } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { UpdateStoreInput } from "@types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  storeService: ModulesSdkTypes.IMedusaInternalService<any>
}

export default class StoreModuleService
  extends MedusaService<{
    Store: { dto: StoreTypes.StoreDTO }
    StoreCurrency: { dto: StoreTypes.StoreCurrencyDTO }
  }>({ Store, StoreCurrency }, entityNameToLinkableKeysMap)
  implements IStoreModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly storeService_: ModulesSdkTypes.IMedusaInternalService<Store>

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

  // @ts-expect-error
  async createStores(
    data: StoreTypes.CreateStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  async createStores(
    data: StoreTypes.CreateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>
  @InjectManager("baseRepository_")
  async createStores(
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
    StoreModuleService.validateCreateRequest(normalizedInput)

    return (
      await this.storeService_.upsertWithReplace(
        normalizedInput,
        { relations: ["supported_currencies"] },
        sharedContext
      )
    ).entities
  }

  async upsertStores(
    data: StoreTypes.UpsertStoreDTO[],
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  async upsertStores(
    data: StoreTypes.UpsertStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>
  @InjectTransactionManager("baseRepository_")
  async upsertStores(
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

  // @ts-expect-error
  async updateStores(
    id: string,
    data: StoreTypes.UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO>
  async updateStores(
    selector: StoreTypes.FilterableStoreProps,
    data: StoreTypes.UpdateStoreDTO,
    sharedContext?: Context
  ): Promise<StoreTypes.StoreDTO[]>
  @InjectManager("baseRepository_")
  async updateStores(
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
    StoreModuleService.validateUpdateRequest(normalizedInput)

    return (
      await this.storeService_.upsertWithReplace(
        normalizedInput,
        { relations: ["supported_currencies"] },
        sharedContext
      )
    ).entities
  }

  private static normalizeInput<T extends StoreTypes.UpdateStoreDTO>(
    stores: T[]
  ): T[] {
    return stores.map((store) =>
      removeUndefined({
        ...store,
        supported_currencies: store.supported_currencies?.map((c) => ({
          ...c,
          currency_code: c.currency_code.toLowerCase(),
        })),
        name: store.name?.trim(),
      })
    )
  }

  private static validateCreateRequest(stores: StoreTypes.CreateStoreDTO[]) {
    for (const store of stores) {
      if (store.supported_currencies?.length) {
        const duplicates = getDuplicates(
          store.supported_currencies?.map((c) => c.currency_code)
        )

        if (duplicates.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Duplicate currency codes: ${duplicates.join(", ")}`
          )
        }

        let seenDefault = false
        store.supported_currencies?.forEach((c) => {
          if (c.is_default) {
            if (seenDefault) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Only one default currency is allowed`
              )
            }
            seenDefault = true
          }
        })

        if (!seenDefault) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `There should be a default currency set for the store`
          )
        }
      }
    }
  }

  private static validateUpdateRequest(stores: UpdateStoreInput[]) {
    StoreModuleService.validateCreateRequest(stores)
  }
}
